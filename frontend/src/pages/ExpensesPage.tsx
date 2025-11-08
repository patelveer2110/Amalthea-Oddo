import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { expensesApi } from "@/api/expenses"
import type { Expense } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ExpensesPage() {
  const [filters, setFilters] = useState<{ project?: string; billable?: string; approved?: string }>({})
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses", filters],
    queryFn: async () => (await expensesApi.getAll(filters as any)).data,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-gray-600 text-sm">Team reimbursements and project costs</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Project ID"
            className="px-3 py-2 border rounded"
            value={filters.project || ""}
            onChange={(e) => setFilters((f) => ({ ...f, project: e.target.value || undefined }))}
          />
          <select
            className="px-3 py-2 border rounded"
            value={filters.billable || ""}
            onChange={(e) => setFilters((f) => ({ ...f, billable: e.target.value || undefined }))}
          >
            <option value="">All</option>
            <option value="true">Billable</option>
            <option value="false">Non-billable</option>
          </select>
          <select
            className="px-3 py-2 border rounded"
            value={filters.approved || ""}
            onChange={(e) => setFilters((f) => ({ ...f, approved: e.target.value || undefined }))}
          >
            <option value="">Any Approval</option>
            <option value="true">Approved</option>
            <option value="false">Pending/Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <div>Loading...</div>}
        {!isLoading &&
          expenses.map((ex: Expense) => (
            <Card key={ex.id}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{ex.category}</span>
                  <span className={`text-xs px-2 py-1 rounded ${ex.billable ? "bg-blue-100" : "bg-gray-100"}`}>
                    {ex.billable ? "Billable" : "Non-billable"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{new Date(ex.date).toLocaleDateString()}</div>
                  <div className="text-lg font-semibold">
                    {ex.currency} {ex.amount}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Project: {ex.projectId}</div>
                {ex.notes && <div className="text-xs text-gray-600 mt-2">{ex.notes}</div>}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
