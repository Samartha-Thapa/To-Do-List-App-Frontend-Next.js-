export type Task = {
  id: string
  title: string
  description?: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  assignedDate: Date
  dueDate: Date
  progress: number
  completed: boolean
}
