import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

export function TaskBoard({ projectId }: { projectId: string }) {
  const columns = ["NEW", "IN_PROGRESS", "BLOCKED", "DONE"]
  const tasks = [
    { id: "1", title: "Design Homepage", state: "IN_PROGRESS", priority: "HIGH", estimate: 16 },
    { id: "2", title: "Setup Database", state: "DONE", priority: "HIGH", estimate: 8 },
    { id: "3", title: "Build API", state: "IN_PROGRESS", priority: "HIGH", estimate: 40 },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map((column) => (
        <div key={column} className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-sm text-gray-700">{column.replace("_", " ")}</h3>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.state === column)
              .map((task) => (
                <Card key={task.id} className="cursor-move hover:shadow-md">
                  <CardContent className="p-3">
                    <p className="font-medium text-sm">{task.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          task.priority === "HIGH" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500">{task.estimate}h</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            <Button className="w-full text-sm bg-gray-200 hover:bg-gray-300">+ Add Task</Button>
          </div>
        </div>
      ))}
    </div>
  )
}
