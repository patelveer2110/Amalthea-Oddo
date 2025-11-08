import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from "recharts"
import { useEffect, useState } from "react"

interface KPI {
  label: string;
  value: number | string;
}

export function AnalyticsPage() {
  const [taskStatusData, setTaskStatusData] = useState<Array<{ name: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const kpis: KPI[] = [
    { label: "Total Projects", value: 12 },
    { label: "Tasks Completed", value: taskStatusData.find(t => t.name === "DONE")?.value || 0 },
    { label: "Hours Logged", value: 1240 },
    { label: "Billable %", value: "76%" },
  ];

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/v1/analytics/task-status');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setTaskStatusData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  // Mock data for project revenue vs cost
  const projectFinanceData = [
    { name: "Project A", revenue: 50000, cost: 30000 },
    { name: "Project B", revenue: 45000, cost: 25000 },
    { name: "Project C", revenue: 60000, cost: 40000 },
    { name: "Project D", revenue: 35000, cost: 20000 },
    { name: "Project E", revenue: 55000, cost: 35000 }
  ]

  // Mock data for resource utilization over time
  const utilizationData = [
    { month: "Jan", utilization: 75 },
    { month: "Feb", utilization: 82 },
    { month: "Mar", utilization: 78 },
    { month: "Apr", utilization: 85 },
    { month: "May", utilization: 90 },
    { month: "Jun", utilization: 88 }
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-600 text-sm">Progress, utilization and profitability overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">{k.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                      label={(props) => {
                        const { name, percent } = props as any;
                        const p = typeof percent === 'number' ? percent : Number(percent);
                        return p ? `${name} ${(p * 100).toFixed(0)}%` : '';
                      }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Project Cost vs Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectFinanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#00C49F" name="Revenue" />
                  <Bar dataKey="cost" fill="#FF8042" name="Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Resource Utilization Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={utilizationData}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="utilization"
                    stroke="#0088FE"
                    name="Utilization %"
                    dot={{ fill: "#0088FE" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
