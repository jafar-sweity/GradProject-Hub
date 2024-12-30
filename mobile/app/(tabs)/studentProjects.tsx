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
              <View
                key={project.project_id}
                className="mb-6 p-4 bg-card shadow-md border border-card-border"
                style={{ borderRadius: 12 }}
              >
                <Text className="text-xl font-semibold text-card-foreground">
                  {project.Project.name}
                </Text>
                <Text className="text-muted-foreground mt-2">
                  {project.Project.description || "No description available."}
                </Text>

                <View className="mt-4">
                  <Text className="text-foreground font-medium mb-2">
                    Supervisor:
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {supervisor && (
                      <Text className="mb-2 px-3 py-1 rounded-full bg-green-100 text-green-800">
                        {supervisor.User.name}
                      </Text>
                    )}
                  </View>
                  <Text className="text-foreground font-medium mb-2">
                    Team Members:
                  </Text>
                  {loadingMembers[project.project_id] ? (
                    <ActivityIndicator size="small" color="#999" />
                  ) : (
                    <View className="flex-row flex-wrap gap-2">
                      {members?.length ? (
                        members.map((member: any) => (
                          <Text
                            key={member.user_id}
                            className={`px-3 py-1 rounded-full bg-blue-100 text-blue-800`}
                          >
                            {member.User.name}
                          </Text>
                        ))
                      ) : (
                        <Text className="text-muted-foreground">
                          No members found.
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                <View className="flex-row justify-between mt-6">
                  <TouchableOpacity
                    onPress={() => {
                      router.push(`/${project.project_id}`);
                    }}
                    className="bg-primary px-4 py-2"
                    style={{ borderRadius: 8 }}
                  >
                    <Text className="text-primary-foreground">
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
