"use client"

import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { projectsApi } from "@/api/projects"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskBoard } from "@/components/TaskBoard"
import { TimesheetList } from "@/components/TimesheetList"
import { FinancePanel } from "@/components/FinancePanel"
import { ArrowLeft } from "lucide-react"

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await projectsApi.getById(projectId!)
      return res.data
    },
  })

  const { data: financials } = useQuery({
    queryKey: ["project-financials", projectId],
    queryFn: async () => {
      const res = await projectsApi.getFinancials(projectId!)
      return res.data
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-sm text-gray-500">{project.code}</p>
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>
      </div>

      {/* Project Header with KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Budget Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">65%</p>
            <p className="text-xs text-gray-500">$97.5K of $150K</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(financials?.revenue || 0) / 1000}K</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(financials?.cost || 0) / 1000}K</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${(financials?.profit || 0) / 1000}K</p>
            <p className="text-xs text-gray-500">{(financials?.profitMargin || 0).toFixed(1)}% margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tasks" className="bg-white rounded-lg border">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="p-4">
          <TaskBoard projectId={projectId!} />
        </TabsContent>

        <TabsContent value="timesheets" className="p-4">
          <TimesheetList projectId={projectId!} />
        </TabsContent>

        <TabsContent value="expenses" className="p-4">
          <div className="text-center text-gray-500 py-8">Expenses coming soon</div>
        </TabsContent>

        <TabsContent value="finance" className="p-4">
          <FinancePanel projectId={projectId!} />
        </TabsContent>

        <TabsContent value="docs" className="p-4">
          <div className="text-center text-gray-500 py-8">Documents & links coming soon</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
