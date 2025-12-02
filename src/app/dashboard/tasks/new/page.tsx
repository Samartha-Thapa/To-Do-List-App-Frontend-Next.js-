import { TodoForm } from "@/components/todo-form"

export default function Home() {
 
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Task Manager</h1>
          <p className="text-muted-foreground">Create and manage your tasks efficiently</p>
        </div>

        <TodoForm />
      </div>
    </div>
  )
}
