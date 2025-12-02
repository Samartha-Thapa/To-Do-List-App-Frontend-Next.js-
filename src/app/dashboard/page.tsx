import CalendarForm from '@/components/calendar';
import { TaskCard } from '@/components/task-card';
import { Task } from '@/lib/tasks';
import Link from 'next/link';
import React from 'react';
import "react-calendar/dist/Calendar.css";
import { cookies } from "next/headers";

const Dashboard = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  async function fetchTasks () {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const tasks: Task[] = await response.json();
    return tasks;
  }

  await new Promise((resolve) => setTimeout(resolve, 3000));
  const tasks = await fetchTasks();

  // calculate time left %
  const getTaskInfo = (task: Task) => {
    if (!task.dueDate || !task.assignedDate) return { timePercent: Infinity, timeLeft: Infinity };

    const dueDate = new Date(task.dueDate).getTime();
    const assignedDate = new Date(task.assignedDate).getTime();
    const currentTime = Date.now();

    const totalTime = dueDate - assignedDate;
    const timeLeft = dueDate - currentTime;

    if (totalTime <= 0) return { timePercent: Infinity, timeLeft };

    const timePercent = (timeLeft / totalTime) * 100;
    return { timePercent, timeLeft };
  }

  // sort tasks by urgency (less time left first)
  const sortedTasks = [...tasks].sort((a, b) => {
    const { timeLeft: leftA } = getTaskInfo(a);
    const { timeLeft: leftB } = getTaskInfo(b);
    return leftA - leftB;
  });

  // always take up to 4 most urgent tasks
  const topTasks = sortedTasks.slice(0, 4);


  return (
    <div className='grid grid-cols-1 md:grid-cols-2 p-4 gap-4'>
      <div className='border-b-2 md:border-r-2 border-slate-200 p-4 rounded-lg'>
        <div className='font-bold text-2xl italic text-center'>Approaching deadline</div>
        <ul className='grid grid-cols-1 gap-4 ml-2 mt-8'>
          {topTasks.map((task) => (
            <li key={task.id}>
              <Link href={`/dashboard/tasks/${task.id}`}>
                <TaskCard task={task} id={task.id} />
              </Link>
            </li>
          ))}
          {topTasks.length === 0 && (
            <p className="text-gray-500 text-center">No tasks available</p>
          )}
        </ul>
      </div>

      <div className='flex flex-col items-center p-4'>
        <div className='p-4 w-full flex justify-center'>
            <CalendarForm />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
