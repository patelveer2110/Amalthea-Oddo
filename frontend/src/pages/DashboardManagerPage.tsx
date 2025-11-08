import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectsApi } from "../api/projects"
import { timesheetsApi } from "../api/timesheets"
import { expensesApi } from "../api/expenses"
import { usersApi } from "../api/users"
import { tasksApi } from "../api/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"

export function DashboardManagerPage() {
  const queryClient = useQueryClient()

  // --- Real-time settings ---
  const POLL_MS = 15_000

  // 🔹 Queries (auto-refresh)
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await projectsApi.getAll()).data,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })

  const { data: timesheets = [] } = useQuery({
    queryKey: ["timesheets"],
    queryFn: async () => (await timesheetsApi.getAll()).data,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => (await expensesApi.getAll()).data,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await usersApi.getAll()).data,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })

  // ✅ Task analytics (DONE count for "Tasks Completed")
  const { data: taskAnalytics = [] } = useQuery({
    queryKey: ["tasks-analytics"],
    queryFn: async () => (await tasksApi.getAnalytics()).data,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })

  // 🔹 Stats (computed)
  const active = projects.filter((p: any) => p.status === "ACTIVE").length
  const hoursLogged = timesheets.reduce((s: number, t: any) => s + (Number(t.durationHours) || 0), 0)
  const approvedExpenses = expenses.filter((e: any) => !!e.approved).length
  const tasksCompleted = taskAnalytics
  .filter((x: any) => String(x.name).toUpperCase() === "DONE")
  .reduce((sum: number, x: any) => sum + Number(x.value || 0), 0)


  // 🔹 UI states
  const [showCreateProject, setShowCreateProject] = useState(false)

  // 🔹 New Project form state
  const [newProject, setNewProject] = useState({
    name: "",
    code: "",
    currency: "USD",
    budgetAmount: undefined as number | undefined,
  })

  const createProjectMutation = useMutation({
    mutationFn: () =>
      projectsApi.create({
        ...newProject,
        status: "PLANNING",
        startDate: new Date().toISOString().slice(0, 10),
      }),
    onSuccess: () => {
      setShowCreateProject(false)
      setNewProject({ name: "", code: "", currency: "USD", budgetAmount: undefined })
      // Make all cards refresh immediately
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["tasks-analytics"] })
      queryClient.invalidateQueries({ queryKey: ["timesheets"] })
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
  })

  // 🔄 Manual refresh for all KPI queries
  function refreshAll() {
    queryClient.invalidateQueries({ queryKey: ["projects"] })
    queryClient.invalidateQueries({ queryKey: ["tasks-analytics"] })
    queryClient.invalidateQueries({ queryKey: ["timesheets"] })
    queryClient.invalidateQueries({ queryKey: ["expenses"] })
    queryClient.invalidateQueries({ queryKey: ["users"] })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Manager</h1>
          <p className="text-gray-600">Plan, assign, and track</p>
        </div>
        <div className="space-x-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreateProject((s) => !s)}
          >
            New Project
          </Button>
          <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200" onClick={refreshAll}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Dashboard Stats (real-time) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{active}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tasksCompleted}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Hours Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{hoursLogged}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Approved Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{approvedExpenses}</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Project Form */}
      {showCreateProject && (
        <div className="border rounded bg-white p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              className="border rounded px-2 py-1"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              className="border rounded px-2 py-1"
              placeholder="Code"
              value={newProject.code}
              onChange={(e) => setNewProject((p) => ({ ...p, code: e.target.value }))}
            />
            <input
              className="border rounded px-2 py-1"
              placeholder="Budget (optional)"
              type="number"
              value={newProject.budgetAmount ?? ""}
              onChange={(e) =>
                setNewProject((p) => ({
                  ...p,
                  budgetAmount: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
            <select
              className="border rounded px-2 py-1"
              value={newProject.currency}
              onChange={(e) => setNewProject((p) => ({ ...p, currency: e.target.value }))}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => createProjectMutation.mutate()}
              disabled={!newProject.name || !newProject.code || createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-mono text-gray-500">{project.code}</p>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        project.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }} />
                  </div>
                  {project.budgetAmount && (
                    <p className="text-xs text-gray-500">
                      Budget: ${Number(project.budgetAmount).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardManagerPage
