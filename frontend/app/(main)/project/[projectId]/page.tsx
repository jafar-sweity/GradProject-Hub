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
// Simulate a database read for tasks.
async function getTasks() {
  const tasks = taskData;

  return z.array(taskSchema).parse(tasks);
}

export default function TaskPage({
  params,
}: {
  params: { projectId: number };
}) {
  const [tasks, setTasks] = useState<z.infer<typeof taskSchema>[]>([]);

  const { data, error, loading } = useFetchData(getProjectTasks, [
    params.projectId,
  ]);
  if (!loading) {
    console.log(data);
  }
  useEffect(() => {
    async function fetchTasks() {
      const tasks = await getTasks();
      setTasks(tasks);
    }
    fetchTasks();
  }, []);

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
