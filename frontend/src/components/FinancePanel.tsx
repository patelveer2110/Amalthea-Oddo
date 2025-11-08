"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { timesheetsApi } from "@/api/timesheets"
import { invoicesApi } from "@/api/invoices"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Check } from "lucide-react"

export function FinancePanel({ projectId }: { projectId: string }) {
  const [selectedTimesheets, setSelectedTimesheets] = useState<string[]>([])

  const { data: timesheets = [] } = useQuery({
    queryKey: ["approved-timesheets", projectId],
    queryFn: async () => {
      const res = await timesheetsApi.getAll({ project: projectId, status: "APPROVED" })
      return res.data.filter((ts) => !ts.invoiced)
    },
  })

  const createInvoiceMutation = useMutation({
    mutationFn: (timesheetIds: string[]) => invoicesApi.createFromTimesheets(projectId, timesheetIds),
    onSuccess: () => {
      setSelectedTimesheets([])
      alert("Invoice created successfully!")
    },
  })

  const toggleTimesheet = (id: string) => {
    setSelectedTimesheets((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const totalAmount = timesheets
    .filter((ts) => selectedTimesheets.includes(ts.id))
    .reduce((sum, ts) => sum + ts.amount, 0)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Create Invoice from Timesheets</h3>

      <div className="space-y-2">
        {timesheets.map((ts) => (
          <Card key={ts.id} className={selectedTimesheets.includes(ts.id) ? "bg-blue-50 border-blue-300" : ""}>
            <CardContent className="p-4 flex items-center gap-3">
              <input
                type="checkbox"
                title={`Select timesheet on ${new Date(ts.workDate).toLocaleDateString()}`}
                aria-label={`Select timesheet on ${new Date(ts.workDate).toLocaleDateString()}`}
                checked={selectedTimesheets.includes(ts.id)}
                onChange={() => toggleTimesheet(ts.id)}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-medium">
                  {ts.durationHours}h @ ${ts.hourlyRate}/h
                </p>
                <p className="text-sm text-gray-600">{new Date(ts.workDate).toLocaleDateString()}</p>
              </div>
              <span className="font-semibold">${ts.amount}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTimesheets.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Invoice Amount:</span>
            <span className="text-2xl font-bold text-blue-600">${totalAmount}</span>
          </div>
          <Button
            onClick={() => createInvoiceMutation.mutate(selectedTimesheets)}
            disabled={createInvoiceMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {createInvoiceMutation.isPending ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      )}
    </div>
  )
}
