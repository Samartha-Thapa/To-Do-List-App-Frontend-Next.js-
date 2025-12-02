import { TaskCard } from "@/components/task-card";
import type { Task } from "@/lib/tasks";
import { format } from "date-fns";
import React from "react";
import { cookies } from "next/headers";

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }){
  const { id } = await params;

  const storedCookie = await cookies();
  const token = storedCookie.get("token")?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  });

  const task: Task = await response.json();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold 
            ${task.priority === "high"
              ? "bg-red-200 text-red-700"
              : task.priority === "medium"
              ? "bg-yellow-200 text-yellow-700"
              : task.priority === "urgent"
              ? "bg-red-300 text-red-800"
              : "bg-green-200 text-green-700"}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-base">{task.description}</p>

      {/* Details panel */}
      <div className="grid grid-cols-2 gap-4 bg-white rounded-2xl shadow-md p-6">
        <div>
          <p className="text-gray-500 text-sm">Task ID</p>
          <p className="font-medium">{id}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Category</p>
          <p className="font-medium">{task.category}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Assigned Date</p>
          <p className="font-medium">
            {format(task.assignedDate, "dd/MM/yyyy")}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Due Date</p>
          <p className="font-medium">
            {format(task.dueDate, "dd/MM/yyyy")}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{task.progress}%</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Completed</p>
          <p
            className={`font-medium ${
              task.completed ? "text-green-600" : "text-red-600"
            }`}
          >
            {task.completed ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* Reuse TaskCard at bottom if you want */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Compact View</h2>
        <TaskCard task={task} id={id}/>
      </div>
    </div>
  )
}
