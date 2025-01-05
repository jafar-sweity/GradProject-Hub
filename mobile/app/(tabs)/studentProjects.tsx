import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { getStudentProject } from "@/services/studentProjects";
import { getProjectMembers } from "@/services/project";
import useFetchData from "@/hooks/useFetchData";
import { router } from "expo-router";
import ProjectCard from "@/components/ProjectCard";

const StudentProjectsScreen = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: projects, loading: projectLoading } = useFetchData(
    getStudentProject,
    [user?.id]
  ) as any;

  const [projectMembersMap, setProjectMembersMap] = useState<
    Record<number, any[]>
  >({});
  const [loadingMembers, setLoadingMembers] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    if (projects) {
      if (!projects.length) return;
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
  }, [projects]);

  if (authLoading || projectLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="hsl(142.1 70.6% 45.3%)" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-foreground mb-6">
          My Projects
        </Text>
        {projects?.length ? (
          projects.map((project: any) => {
            let members = projectMembersMap[project.project_id] || [];

            const supervisor = members.find(
              (member: any) => member.role === "supervisor"
            );

            members = members.filter(
              (member: any) => member.role === "student"
            );
            return (
              <ProjectCard
                key={project.project_id}
                project={project}
                members={members}
                supervisor={supervisor}
                loading={loadingMembers[project.project_id]}
              />
            );
          })
        ) : (
          <Text className="text-muted-foreground text-center">
            No projects found.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentProjectsScreen;
