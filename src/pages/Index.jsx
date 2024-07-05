import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchTasks = async () => {
  const response = await fetch("/api/tasks");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const addTask = async (newTask) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Index = () => {
  const queryClient = useQueryClient();
  const { data: tasks, error, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const mutation = useMutation(addTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
      toast.success("Task added successfully");
    },
    onError: () => {
      toast.error("Failed to add task");
    },
  });

  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    mutation.mutate({ name: newTask });
    setNewTask("");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl">Today</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Task name"
              />
              <Button onClick={handleAddTask}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox checked={task.completed} />
                <span>{task.name}</span>
              </div>
              <div className="space-x-2">
                <Button variant="outline">Edit</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;