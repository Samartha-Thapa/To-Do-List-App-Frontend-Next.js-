"use client"

import React, { useEffect, useState } from "react"
import type { Task } from "@/lib/tasks"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function EditTask({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        const token = Cookies.get("token")
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (!res.ok) throw new Error("Failed to fetch task")
        const data = await res.json()
        setTask(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchTask()
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!task) return

    try {
      const token = Cookies.get("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        }
      )
      if (!res.ok) throw new Error("Failed to update task")
      router.push(`/dashboard/tasks/${id}`)
    } catch (err) {
      console.error(err);
      setError("Update failed")
    }
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>
  if (!task) return <p className="p-6">No task found</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={task.description ?? ""}
            onChange={(e) =>
              setTask({ ...task, description: e.target.value })
            }
            className="w-full border rounded-lg p-2"
            rows={3}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            value={task.category}
            onChange={(e) => setTask({ ...task, category: e.target.value })}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select
            value={task.priority}
            onChange={(e) =>
              setTask({ ...task, priority: e.target.value as Task["priority"] })
            }
            className="w-full border rounded-lg p-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Progress */}
        <div>
          <label className="block text-sm font-medium">Progress (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={task.progress}
            onChange={(e) =>
              setTask({ ...task, progress: Number(e.target.value) })
            }
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Completed */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) =>
              setTask({ ...task, completed: e.target.checked })
            }
          />
          <label className="text-sm font-medium">Completed</label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
