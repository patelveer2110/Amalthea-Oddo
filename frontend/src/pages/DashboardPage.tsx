import { useQuery } from "@tanstack/react-query"
import { projectsApi } from "@/api/projects"
import { timesheetsApi } from "@/api/timesheets"
import { tasksApi } from "@/api/tasks"
import { useAuthStore } from "@/store/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { TrendingUp, Briefcase, Clock, DollarSign } from "lucide-react"

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await projectsApi.getAll()
      return res.data
    },
  })

  const isTeam = user?.role === "TEAM_MEMBER"
  const isPMOrAdmin = user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN"

  // Team members: fetch only their timesheets for KPI
  const { data: myTimesheets = [] } = useQuery({
    queryKey: ["timesheets", user?.id],
    queryFn: async () => (await timesheetsApi.getAll({ user: user?.id || "" })).data,
    enabled: !!isTeam && !!user?.id,
  })

  // If team, attempt to filter to assigned projects when teamMembers available
  const visibleProjects = isTeam
    ? projects.filter((p: any) => Array.isArray(p.teamMembers) ? p.teamMembers.some((m: any) => m.id === user?.id) : true)
    : projects

  const activeProjects = visibleProjects.filter((p) => p.status === "ACTIVE").length
  const totalBudget = visibleProjects.reduce((sum, p) => sum + (p.budgetAmount || 0), 0)
  const myHours = isTeam ? myTimesheets.reduce((s: number, t: any) => s + (t.durationHours || 0), 0) : 0

  // Team members: fetch tasks from visible projects and filter by assignee
  const { data: myTasks = [] } = useQuery({
    queryKey: ["myTasks", user?.id, visibleProjects.map((p: any) => p.id)],
    queryFn: async () => {
      const all = await Promise.all(
        (visibleProjects as any[]).map(async (p: any) => (await tasksApi.getByProject(p.id)).data),
      )
      return all.flat().filter((t: any) => t.assigneeId === user?.id)
    },
    enabled: !!isTeam && visibleProjects.length > 0 && !!user?.id,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.fullName}</p>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeProjects}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {isTeam ? "My Hours Logged" : "Total Hours Logged"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isTeam ? myHours : 248}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue (Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$24.5K</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(totalBudget / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
          {isPMOrAdmin && <Button className="bg-blue-600 hover:bg-blue-700">New Project</Button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleProjects.map((project) => (
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

      {isTeam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">My Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myTasks.length === 0 && <p className="text-sm text-gray-500">No tasks assigned yet.</p>}
              {myTasks.slice(0, 8).map((t: any) => (
                <div key={t.id} className="flex items-start justify-between border rounded-md p-3 bg-white">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    {t.description && <p className="text-sm text-gray-600 line-clamp-1">{t.description}</p>}
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">{t.state}</span>
                </div>
              ))}
              {myTasks.length > 8 && (
                <Link to="/tasks" className="text-sm text-blue-600 hover:underline">
                  View all tasks
                </Link>
              )}
            </CardContent>
          </Card>

          {/* My Profile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> <span className="font-medium">{user?.fullName}</span></p>
              <p><span className="text-gray-500">Email:</span> <span className="font-medium">{user?.email}</span></p>
              <p><span className="text-gray-500">Role:</span> <span className="font-medium">{user?.role}</span></p>
              <Link to="/profile" className="text-blue-600 hover:underline">Go to profile</Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
