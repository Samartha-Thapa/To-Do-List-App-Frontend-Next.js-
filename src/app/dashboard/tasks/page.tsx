import React from "react"
import type { Task } from "@/lib/tasks"
import { TaskCard } from "@/components/task-card"
import { cookies } from "next/headers"
import Link from "next/link"

const Tasks = async () => {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const tasks: Task[] = await response.json()

  return (
     <div className="mt-8 ml-2">
      <ul className="grid grid-cols-3 gap-4">
        {tasks.map((task) => {
          return (
            <li key={task.id}>
              <Link href={`/dashboard/tasks/${task.id}`}>
                <TaskCard id={task.id} task={task} />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Tasks
