"use client";
import { z } from "zod";

import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { taskSchema } from "../data/schema";
import { useEffect, useState } from "react";
import taskData from "../data/tasks.json";
import useFetchData from "@/hooks/useFetchData";
import { getProjectTasks } from "@/services/tasks";
import { getProjectMembers } from "@/services/project";
import { useSearchParams } from "next/navigation";
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
interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectMember {
  user_id: number;
  project_id: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  User: User;
}

async function getTasks() {
  const tasks = taskData;

  return z.array(taskSchema).parse(tasks);
}

export default function TaskPage({
  params,
}: {
  params: { projectId: number };
}) {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<z.infer<typeof taskSchema>[]>([]);

  const { data: tasksData, loading: tasksLoading } = useFetchData(
    getProjectTasks,
    [params.projectId]
  );
  const {
    data: projectMembers,
    loading: projectMembersLoading,
  }: { data: ProjectMember[] | null; loading: boolean } = useFetchData(
    getProjectMembers,
    [params.projectId]
  );

  const students: Record<number, string> = {};
  const supervisors: Record<number, string> = {};
  if (!projectMembersLoading && projectMembers) {
    projectMembers.forEach((member: ProjectMember) => {
      if (member.role === "student") {
        students[member.user_id] = member.User.name;
      } else if (member.role === "supervisor") {
        supervisors[member.user_id] = member.User.name;
      }
    });
  }
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
          assignedToName: students[Number(task.assigned_to)],
        }));

        tasks = [...projectTasks, ...tasks];
      }
      setTasks(tasks);
    }
    fetchTasks();
  }, [tasksData, tasksLoading]);

  return (
    <>
      {tasksLoading ? (
        <div className="w-full flex justify-center">
          <span className="loading loading-dots loading-xs bg-primary"></span>
        </div>
      ) : (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex bg-card rounded-2xl">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back!
              </h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of {searchParams.get("projectName")} tasks!
              </p>
            </div>
            <div className="flex items-end space-x-2 flex-col ">
              <p className="text-muted-foreground text-sm">
                Your Supervisor(s) : {Object.values(supervisors).join(", ")}
              </p>
              <p className="text-muted-foreground text-sm">
                Project Members : {Object.values(students).join(", ")}{" "}
              </p>
            </div>
          </div>
          <DataTable
            data={tasks}
            setTasks={setTasks}
            columns={columns}
            projectId={String(params.projectId)}
          />
        </div>
      )}
    </>
  );
}
