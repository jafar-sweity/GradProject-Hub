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
import { UserIcon, Search, Plus } from "lucide-react";
import { getSemesters } from "@/services/semester";
import { Input } from "@/components/ui/input";
import { Snackbar, Alert, SnackbarCloseReason } from "@mui/material";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectDialog from "@/components/projectDialog";
import { addProject, updateProject } from "@/services/supervisorProjects";
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    setIsDialogOpen(true);
    setEditingProject({
      project_id: project.project_id,
      name: project.Project.name,
      description: project.Project.description,
      students: project.members.map((member: any) => member.User.email),
    });
  };

  const handleDialogSubmit = async (data: {
    project_id?: string;
    name: string;
    description: string;
    students: string[];
  }) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.project_id, data);
        setSnackBarMessage("Project updated successfully!");
        setSeverity("success");
      } else {
        await addProject(data);
        setSnackBarMessage("New project added successfully!");
        setSeverity("success");
      }
      setOpenSnackBar(true);
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.log("Error adding project:", error);
      setSnackBarMessage("An error occurred. Please try again.");
      setSeverity("error");
      setOpenSnackBar(true);
    }
  };

  const [projectMembersMap, setProjectMembersMap] = useState<
    Record<number, ProjectMember[]>
  >({});
  const [loadingMembers, setLoadingMembers] = useState<Record<number, boolean>>(
    {}
  );
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
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
              const studentMembers = members.filter(
                (member: any) => member.role === "student"
              );
              setProjectMembersMap((prev) => ({
                ...prev,
                [project.project_id]: studentMembers,
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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

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
        <Button
          className="ml-auto"
          onClick={() => {
            handleAddProject();
          }}
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
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

              <CardFooter className="flex justify-between items-center p-4 rounded-b-lg bg-card shadow-md border-t">
                <div className="flex items-center space-x-4">
                  <Link href={`/projects/${project.project_id}`} passHref>
                    <Button className="text-primary-foreground bg-primary hover:bg-primary/90 transition-all rounded-lg px-4 py-2 text-sm font-semibold">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    className="text-secondary-foreground bg-secondary hover:bg-secondary/90 transition-all rounded-lg px-4 py-2 text-sm font-semibold"
                    onClick={() =>
                      handleEditProject({
                        ...project,
                        members: projectMembersMap[project.project_id],
                      })
                    }
                  >
                    Edit
                  </Button>
                </div>

                <div className="flex items-center text-muted-foreground text-xs space-x-2">
                  <time dateTime={project.updatedAt}>
                    Last Updated:{" "}
                    {new Date(project.updatedAt).toLocaleDateString("en-GB")}
                  </time>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No projects found.
          </p>
        )}
      </div>
      <ProjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        initialValues={editingProject}
      />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          severity={severity}
          variant="filled"
          className="w-full"
          onClose={handleClose}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
