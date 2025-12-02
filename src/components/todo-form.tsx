"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Plus } from "lucide-react"
import type { Task } from "@/lib/tasks"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

interface TodoFormProps {
  initialTask?: Partial<Task>
}

export function TodoForm({ initialTask }: TodoFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get("token")?? null;
    setToken(storedToken);
  }, [])

  const [formData, setFormData] = useState({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    category: initialTask?.category || "",
    priority: initialTask?.priority || ("medium" as const),
    assignedDate: initialTask?.assignedDate
      ? initialTask.assignedDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    dueDate: initialTask?.dueDate ? initialTask.dueDate.toISOString().split("T")[0] : "",
    progress: initialTask?.progress || 0,
    completed: initialTask?.completed || false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        assignedDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        progress: 0,
        completed: false,
      })

      const response = await fetch('http://127.0.0.1:8000/api/tasks/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
      });

      if(!response.ok) {
        throw new Error('Failed to add task');
      }

      alert("Task Created!");
      router.push('/dashboard/tasks')
    } catch (error) {
      console.error("Error submitting task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const priorityColors = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-orange-600",
    urgent: "text-red-600",
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-2 border-primary">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Plus className="h-6 w-6" />
            CREATE NEW TASK
          </CardTitle>
          <p className="text-muted-foreground">Fill out the details below to create a new task for your todo list</p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-primary uppercase tracking-wide">
                Task Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                required
                className="border-2 border-primary focus:border-primary focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-primary uppercase tracking-wide">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Add task description (optional)"
                rows={3}
                className="border-2 border-primary focus:border-primary focus:ring-primary resize-none"
              />
            </div>

            {/* Category and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Category
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Work, Personal, Health"
                  required
                  className="border-2 border-primary focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="border-2 border-primary focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-green-600">
                      Low Priority
                    </SelectItem>
                    <SelectItem value="medium" className="text-yellow-600">
                      Medium Priority
                    </SelectItem>
                    <SelectItem value="high" className="text-orange-600">
                      High Priority
                    </SelectItem>
                    <SelectItem value="urgent" className="text-red-600">
                      Urgent
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedDate" className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Assigned Date
                </Label>
                <div className="relative">
                  <Input
                    id="assignedDate"
                    type="date"
                    value={formData.assignedDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, assignedDate: e.target.value }))}
                    required
                    className="border-2 border-primary focus:border-primary focus:ring-primary"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Due Date
                </Label>
                <div className="relative">
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                    required
                    className="border-2 border-primary focus:border-primary focus:ring-primary"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Progress Slider */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-primary uppercase tracking-wide">
                Progress: {formData.progress}%
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.progress]}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, progress: value[0] }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-3">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Completed Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={formData.completed}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, completed: checked as boolean }))}
              />
              <Label htmlFor="completed" className="text-sm font-medium">
                Mark as completed
              </Label>
            </div>

            {/* Task Summary */}
            <Card className="bg-muted/50 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold text-primary mb-2">TASK SUMMARY</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Title:</span> {formData.title || "Not specified"}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {formData.category || "Not specified"}
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span>
                    <span className={`ml-1 font-semibold ${priorityColors[formData.priority]}`}>
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Due Date:</span> {formData.dueDate || "Not set"}
                  </div>
                  <div>
                    <span className="font-medium">Progress:</span> {formData.progress}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.category || !formData.dueDate}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-lg"
            >
              {isSubmitting ? "Creating Task..." : "Create Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
