"use client"

import { CheckCircle, Trash2, Edit } from "lucide-react"
import type { Task } from "@/lib/tasks"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ImCross } from "react-icons/im";
import Cookies from "js-cookie"

interface TaskCardProps {
  task: Task;
  id: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, id }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // Format due date properly
  const formatDueDate = (date: string | Date) => {
    // return date.toLocaleDateString()
    return format(new Date(date), "dd/MM/yyyy");
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try{
      const token = Cookies.get("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })
      if(!res.ok) throw new Error("Failed to delete task");

      router.refresh();
    } catch (error) {
      console.log("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-bold 
          ${task.priority === "high" ? "bg-red-200 text-red-700" :
            task.priority === "medium" ? "bg-yellow-200 text-yellow-700" :
            task.priority === "urgent" ? "bg-red-300 text-red-800" :
            "bg-green-200 text-green-700"}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-gray-600 text-sm">{task.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Due: {formatDueDate(task.dueDate)}
        </span>
        <div className="flex gap-3">
          {task.progress === 100 ?
          (
            <CheckCircle className="text-green-500 cursor-pointer" size={18} />
          ):(
            <ImCross className="text-red-500 cursor point" size={16} />
          )}
            <Edit className="text-blue-500 cursor-pointer" size={18} onClick={() => router.push(`/dashboard/tasks/${id}/edit`)} />
            <Trash2
                className="text-red-500 cursor-pointer" 
                size={18}
                onClick={() => handleDelete()}
                aria-disabled={isDeleting}
            />
        </div>
      </div>
    </div>
  )
}