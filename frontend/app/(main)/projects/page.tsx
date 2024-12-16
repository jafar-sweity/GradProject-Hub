/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import useFetchData from "@/hooks/useFetchData";
import { getProjectMembers } from "@/services/project";
import { getSupervisorProjects } from "@/services/supervisorProjects";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UserIcon, Search } from "lucide-react";
import { getSemesters } from "@/services/semester";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function ProjectsPage() {
  const { user } = useAuth();

  const { data: semesters } = useFetchData(getSemesters, []);

  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(
    semesters?.[0]?.name
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: projects, loading: projectsLoading } = useFetchData(
    getSupervisorProjects,
    [user?.id ?? "", selectedSemester ?? ""]
  );

  const [projectMembersMap, setProjectMembersMap] = useState<
    Record<number, ProjectMember[]>
  >({});
  const [loadingMembers, setLoadingMembers] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    if (projects) {
      projects.forEach((project: any) => {
        if (!projectMembersMap[project.project_id]) {
          setLoadingMembers((prev) => ({
            ...prev,
            [project.project_id]: true,
          }));
          getProjectMembers(project.project_id)
            .then((members) => {
              setProjectMembersMap((prev) => ({
                ...prev,
                [project.project_id]: members,
              }));
            })
            .finally(() => {
              setLoadingMembers((prev) => ({
                ...prev,
                [project.project_id]: false,
              }));
            });
        }
      });
    }
  }, [projects, projectMembersMap]);

  // Filter projects based on search query
  const filteredProjects = projects?.filter((project: any) => {
    const projectName = project.Project?.name?.toLowerCase() || "";
    const members = projectMembersMap[project.project_id] || [];
    const memberNames = members
      .map((member) => member.User?.name?.toLowerCase())
      .join(" ");

    return (
      projectName.includes(searchQuery.toLowerCase()) ||
      memberNames.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Supervised Projects</h1>
        <p className="text-muted-foreground">
          A list of all the projects you are supervising.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative w-full max-w-md ">
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search projects or members..."
            className="pl-10 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-[15%] max-w-xs">
          <Select
            value={selectedSemester}
            onValueChange={(value) => setSelectedSemester(value)}
          >
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters?.length ? (
                semesters.map((semester: any) => (
                  <SelectItem key={semester.name} value={semester.name}>
                    {semester.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No semesters available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button className="ml-auto">Add Project</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-48 w-full" />
          ))
        ) : filteredProjects?.length ? (
          filteredProjects.map((project: any) => (
            <Card
              key={project.project_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{project.Project.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {project.Project.description || "No description available."}
                </p>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Team Members:</h3>
                  {loadingMembers[project.project_id] ? (
                    <Skeleton className="h-4 w-3/4" />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {projectMembersMap[project.project_id]?.length ? (
                        projectMembersMap[project.project_id].map(
                          (member) =>
                            member.role === "student" && (
                              <Link
                                href={`/users/${member.User.name}`}
                                key={member.user_id}
                              >
                                <Badge
                                  key={member.user_id}
                                  className={`flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-100/80 text-blue-700`}
                                >
                                  <UserIcon className="w-4 h-4" />
                                  {member.User.name}
                                </Badge>
                              </Link>
                            )
                        )
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No members found.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <Link href={`/projects/${project.project_id}`}>
                  <Button variant="link">View Details</Button>
                </Link>
                <span className="text-xs text-muted-foreground">
                  Last Updated:{" "}
                  {new Date(project.updatedAt).toLocaleDateString("en-GB")}
                </span>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No projects found.
          </p>
        )}
      </div>
    </div>
  );
}
