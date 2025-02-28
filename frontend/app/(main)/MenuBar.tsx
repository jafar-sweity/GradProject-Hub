"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import useFetchData from "@/hooks/useFetchData";
import { getStudentProject } from "@/services/studentProjects";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Bookmark,
  Home,
  Mail,
  ListChecks,
  ChevronRight,
  FileText,
  Video,
  LayoutDashboard,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const { user } = useAuth();

  const { data: projectData, loading } = useFetchData(
    user?.role === "student" ? getStudentProject : async () => null,
    [user?.role === "student" ? user?.id ?? "" : ""]
  );

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user?.role === "student" ? (
        <Collapsible open={isProjectsOpen} onOpenChange={setIsProjectsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-between w-full px-4 py-2 hover:bg-accent hover:text-accent-foreground"
              title="Projects"
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            >
              <div className="flex items-center gap-3">
                <ListChecks className="h-4 w-4" />
                <span className="hidden lg:inline">Projects</span>
              </div>
              <motion.div
                animate={{ rotate: isProjectsOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </CollapsibleTrigger>

          <AnimatePresence>
            {isProjectsOpen &&
              !loading &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              projectData?.map((project: any) => (
                <CollapsibleContent forceMount asChild key={project.project_id}>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-6 mt-1 overflow-hidden"
                  >
                    <div className="border-l-2 border-muted pl-4 py-1 space-y-2">
                      {/* Project Title */}
                      <Link
                        href={`/projects/${
                          project.project_id
                        }?projectName=${encodeURIComponent(
                          project.Project.name
                        )}`}
                        className="flex items-center gap-3 py-2 font-semibold hover:text-primary transition-colors"
                      >
                        {loading ? (
                          <div className="w-full flex justify-center">
                            <span className="loading loading-dots loading-xs bg-primary"></span>
                          </div>
                        ) : (
                          <span className="text-base">
                            {project.Project.name}
                          </span>
                        )}
                      </Link>

                      <div className="pl-4 text-sm space-y-1">
                        <Link
                          href={`/projects/${project.project_id}/abstract`}
                          className="block hover:text-primary transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Abstract
                          </span>
                        </Link>
                        <Link
                          href={`/projects/${project.project_id}/report`}
                          className="block hover:text-primary transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Report
                          </span>
                        </Link>
                        <Link
                          href={`/projects/${project.project_id}/video_demo`}
                          className="block hover:text-primary transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Demo
                          </span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </CollapsibleContent>
              ))}
          </AnimatePresence>
        </Collapsible>
      ) : (
        (user?.role === "supervisor" || user?.role === "admin") && (
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title="Projects"
            asChild
          >
            <Link href="/projects">
              <ListChecks className="h-4 w-4" />
              <span className="hidden lg:inline">Projects</span>
            </Link>
          </Button>
        )
      )}

      {user?.role === "admin" && (
        <>
          {/* Dashboard Button */}
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-3 w-full px-4 py-2 hover:bg-accent hover:text-accent-foreground"
            title="Dashboard"
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>
          </Button>

          {/* Always Open Semesters Section */}
          <div className="pl-6 mt-1">
            <div className="border-l-2 border-muted pl-4 py-1 space-y-2">
              <Link
                href="/dashboard/semesters"
                className="flex items-center gap-3 py-2 hover:text-primary transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-base">Semesters</span>
              </Link>
            </div>
          </div>
        </>
      )}

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Notifications"
        asChild
      >
        <Link href="/Notifications">
          <Bell />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Messages"
        asChild
      >
        <Link href="/Messages">
          <Mail />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmark"
        asChild
      >
        <Link href="/Bookmark">
          <Bookmark />
          <span className="hidden lg:inline">Bookmark</span>
        </Link>
      </Button>
    </div>
  );
}
