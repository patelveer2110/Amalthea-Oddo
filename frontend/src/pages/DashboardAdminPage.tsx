import { useQuery } from "@tanstack/react-query"
import { projectsApi } from "../api/projects"
import { invoicesApi } from "../api/invoices"
import { expensesApi } from "../api/expenses"
import { usersApi } from "../api/users"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"

export function DashboardAdminPage() {
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: async () => (await projectsApi.getAll()).data })
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices"], queryFn: async () => (await invoicesApi.getAll()).data })
  const { data: expenses = [] } = useQuery({ queryKey: ["expenses"], queryFn: async () => (await expensesApi.getAll()).data })
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: async () => (await usersApi.getAll()).data })

  const totalRevenue = invoices.reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)
  const totalExpenses = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and financial KPIs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Total Projects</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{projects.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Active Users</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{users.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Revenue Earned</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Total Expenses</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p></CardContent></Card>
      </div>

      {/* Lists could be added here with CRUD modals wiring to APIs */}
       <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
          <Button className="bg-blue-600 hover:bg-blue-700">New Project</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
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
export default DashboardAdminPage
