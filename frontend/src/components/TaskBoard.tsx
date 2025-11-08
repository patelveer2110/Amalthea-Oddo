import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { tasksApi } from "@/api/tasks"
import { usersApi } from "@/api/users"
import type { Task, User } from "@/types"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

export function TaskBoard({ projectId, teamMembers }: { projectId: string; teamMembers?: User[] }) {
  const queryClient = useQueryClient()
  const columns: Task["state"][] = ["NEW", "IN_PROGRESS", "BLOCKED", "DONE"]

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => (await tasksApi.getByProject(projectId)).data,
  })

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await usersApi.getAll()).data,
  })

  const assignableUsers: User[] = (teamMembers && teamMembers.length > 0 ? teamMembers : (users as User[])) as User[]
  const [assigneeFilter, setAssigneeFilter] = useState("")

  const grouped = useMemo(() => {
    const map: Record<Task["state"], Task[]> = { NEW: [], IN_PROGRESS: [], BLOCKED: [], DONE: [] }
    for (const t of tasks as Task[]) map[t.state].push(t)
    return map
  }, [tasks])

  const moveMutation = useMutation({
    mutationFn: ({ id, state }: { id: string; state: Task["state"] }) => tasksApi.move(id, state),
    onMutate: async ({ id, state }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] })
      const prev = queryClient.getQueryData<Task[]>(["tasks", projectId]) || []
      queryClient.setQueryData<Task[]>(["tasks", projectId], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, state } : t)),
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["tasks", projectId], ctx.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) => tasksApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<Task>) => tasksApi.create(projectId, data),
    onSuccess: () => {
      setShowCreate(false)
      setNewTask({ title: "", description: "", state: "NEW", priority: "MEDIUM" })
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] })
    },
  })

  const [dragTaskId, setDragTaskId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: "", description: "", state: "NEW", priority: "MEDIUM" })

  function onDragStart(e: React.DragEvent, taskId: string) {
    setDragTaskId(taskId)
    e.dataTransfer.setData("text/plain", taskId)
  }

  function onDrop(_e: React.DragEvent, targetState: Task["state"]) {
    const id = dragTaskId
    setDragTaskId(null)
    if (!id) return
    moveMutation.mutate({ id, state: targetState })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            className="border rounded px-2 py-1 text-sm"
            placeholder="Search assignee by name (e.g., aksh)"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreate((s) => !s)}>
          + New Task
        </Button>
      </div>

      {showCreate && (
        <div className="border rounded bg-white p-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="border rounded px-2 py-1"
              placeholder="Title"
              value={newTask.title || ""}
              onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
            />
            <input
              className="border rounded px-2 py-1 md:col-span-2"
              placeholder="Description"
              value={newTask.description || ""}
              onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))}
            />
            <select
              className="border rounded px-2 py-1"
              value={newTask.state}
              onChange={(e) => setNewTask((t) => ({ ...t, state: e.target.value as Task["state"] }))}
            >
              {columns.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={newTask.priority || "MEDIUM"}
              onChange={(e) => setNewTask((t) => ({ ...t, priority: e.target.value as Task["priority"] }))}
            >
              {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as Task["priority"][]).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={newTask.assigneeId || ""}
              onChange={(e) => setNewTask((t) => ({ ...t, assigneeId: e.target.value || undefined }))}
            >
              <option value="">Unassigned</option>
              {assignableUsers
                .filter((u) => ((u?.fullName || "Unknown").toLowerCase().includes(assigneeFilter.toLowerCase())))
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName || "Unknown"}
                  </option>
                ))}
            </select>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => createMutation.mutate({ ...newTask })}
              disabled={!newTask.title}
            >
              Create
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column}
            className="bg-gray-50 rounded-lg p-4 min-h-[300px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, column)}
          >
            <h3 className="font-semibold mb-4 text-sm text-gray-700">{column.replace("_", " ")}</h3>
            <div className="space-y-3">
              {grouped[column].map((task) => (
                <Card key={task.id} className="hover:shadow-md" draggable onDragStart={(e) => onDragStart(e, task.id)}>
                  <CardContent className="p-3 space-y-2">
                    <p className="font-medium text-sm">{task.title}</p>
                    {task.description && <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          task.priority === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : task.priority === "MEDIUM"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <select
                        className="text-xs border rounded px-1 py-0.5"
                        value={task.assigneeId || ""}
                        onChange={(e) => updateMutation.mutate({ id: task.id, data: { assigneeId: e.target.value || undefined } })}
                      >
                        <option value="">Unassigned</option>
                        {assignableUsers
                          .filter((u) => ((u?.fullName || "").toLowerCase().includes(assigneeFilter.toLowerCase())))
                          .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
