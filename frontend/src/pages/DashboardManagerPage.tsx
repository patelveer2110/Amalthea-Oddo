import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectsApi } from "../api/projects"
import { timesheetsApi } from "../api/timesheets"
import { expensesApi } from "../api/expenses"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"

export function DashboardManagerPage() {
  const queryClient = useQueryClient()
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: async () => (await projectsApi.getAll()).data })
  const { data: timesheets = [] } = useQuery({ queryKey: ["timesheets"], queryFn: async () => (await timesheetsApi.getAll()).data })
  const { data: expenses = [] } = useQuery({ queryKey: ["expenses"], queryFn: async () => (await expensesApi.getAll()).data })

  const active = projects.filter((p: any) => p.status === "ACTIVE").length
  const hoursLogged = timesheets.reduce((s: number, t: any) => s + (t.durationHours || 0), 0)
  const approvedExpenses = expenses.filter((e: any) => e.approved).length

  const [showCreate, setShowCreate] = useState(false)
  const [newProject, setNewProject] = useState<{ name: string; code: string; budgetAmount?: number; currency: string }>(
    { name: "", code: "", currency: "USD" },
  )

  const createMutation = useMutation({
    mutationFn: () =>
      projectsApi.create({
        name: newProject.name,
        code: newProject.code,
        budgetAmount: newProject.budgetAmount,
        currency: newProject.currency,
        status: "PLANNING",
        startDate: new Date().toISOString().slice(0, 10),
      }),
    onSuccess: () => {
      setShowCreate(false)
      setNewProject({ name: "", code: "", currency: "USD" })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Manager</h1>
          <p className="text-gray-600">Plan, approve, and bill</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreate((s) => !s)}>
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Active Projects</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{active}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Tasks Completed</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">--</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Hours Logged</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{hoursLogged}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Approved Expenses</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{approvedExpenses}</p></CardContent></Card>
      </div>

      {showCreate && (
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
              onChange={(e) => setNewProject((p) => ({ ...p, budgetAmount: e.target.value ? Number(e.target.value) : undefined }))}
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
              onClick={() => createMutation.mutate()}
              disabled={!newProject.name || !newProject.code}
            >
              Create
            </Button>
          </div>
        </div>
      )}

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
                        project.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
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
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  {project.budgetAmount && (
                    <p className="text-xs text-gray-500">Budget: ${project.budgetAmount.toLocaleString()}</p>
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
