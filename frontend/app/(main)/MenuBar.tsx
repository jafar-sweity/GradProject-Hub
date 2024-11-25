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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { data: projectData, loading } = useFetchData(getStudentProject, [
    user?.id ?? "",
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start  gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-accent hover:text-accent-foreground"
            title="projects"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-3">
              <ListChecks className="h-4 w-4" />
              <span className="hidden lg:inline">Projects</span>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </CollapsibleTrigger>

        <AnimatePresence>
          {isOpen &&
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
                  <div className="border-l-2 border-muted pl-4 py-1">
                    <Link
                      href={`/project/${project.project_id}`}
                      className="flex items-center gap-3 py-2 hover:text-primary transition-colors"
                    >
                      {loading ? (
                        <div className="w-full flex justify-center">
                          <span className="loading loading-dots loading-xs bg-primary"></span>
                        </div>
                      ) : (
                        <span className="text-sm">{project.Project.name}</span>
                      )}
                    </Link>
                  </div>
                </motion.div>
              </CollapsibleContent>
            ))}
        </AnimatePresence>
      </Collapsible>
      <Button
        variant="ghost"
        className="flex items-center justify-start  gap-3"
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
        className="flex items-center justify-start  gap-3"
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
        className="flex items-center justify-start  gap-3"
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
