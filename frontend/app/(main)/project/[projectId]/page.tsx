"use client";
import { z } from "zod";

import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { UserNav } from "../components/user-nav";
import { taskSchema } from "../data/schema";
import { useEffect, useState } from "react";
import taskData from "../data/tasks.json";
import useFetchData from "@/hooks/useFetchData";
import { getProjectTasks } from "@/services/tasks";
import getUserById from "@/services/userService";
// Simulate a database read for tasks.
async function getTasks() {
  const tasks = taskData;

  return z.array(taskSchema).parse(tasks);
}
interface Task {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  label: string;
  assigned_to: string;
  assignedToName?: string;
}
export default function TaskPage({
  params,
}: {
  params: { projectId: number };
}) {
  const [tasks, setTasks] = useState<z.infer<typeof taskSchema>[]>([]);

  const { data: tasksData, loading: tasksLoading } = useFetchData(
    getProjectTasks,
    [params.projectId]
  );

  useEffect(() => {
    async function fetchTasks() {
      let tasks = await getTasks();
      if (!tasksLoading && tasksData) {
        const projectTasks = tasksData.map((task: Task) => ({
          id: String(task.task_id),
          title: task.title,
          description: task.description,
          dueDate: task.due_date,
          status: task.status,
          priority: task.priority,
          label: task.label,
          assigned_to: String(task.assigned_to),
        }));

        const userPromises = projectTasks.map(
          async (task: {
            id: string;
            title: string;
            description: string;
            dueDate: string;
            status: string;
            priority: string;
            label: string;
            assigned_to: string;
            assignedToName?: string;
          }) => {
            try {
              const user = await getUserById(task.assigned_to);
              return { ...task, assignedToName: user.name };
            } catch (error) {
              console.error(`Error fetching user ${task.assigned_to}:`, error);
              return { ...task, assignedToName: "Unknown User" };
            }
          }
        );

        const tasksWithUsers = await Promise.all(userPromises);
        console.log(tasksWithUsers);
        tasks = [...tasksWithUsers, ...tasks];
      }
      setTasks(tasks);
    }
    fetchTasks();
  }, [tasksData, tasksLoading]);

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex bg-card rounded-2xl">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
