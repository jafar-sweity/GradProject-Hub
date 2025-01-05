import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from "react-native";
import ProjectCard from "@/components/ProjectCard";
import { useAuth } from "@/hooks/useAuth";
import useFetchData from "@/hooks/useFetchData";
import { getProjectMembers } from "@/services/project";
import { getSupervisorProjects } from "@/services/supervisorProjects";
import { getSemesters } from "@/services/semester";
import DropDownPicker from "react-native-dropdown-picker";

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
  user_id: string;
  project_id: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  User: User;
}

export default function SupervisorProjectsPage() {
  const { user } = useAuth();
  const { data: semesters, loading: semesterLoading } = useFetchData(
    getSemesters,
    []
  ) as any;

  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(
    semesters[0]?.name
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: projectsData, loading: projectsLoading } = useFetchData(
    getSupervisorProjects,
    [user?.id ?? "", selectedSemester ?? ""]
  );

  const projects = Array.isArray(projectsData) ? projectsData : [];

  const [projectMembersMap, setProjectMembersMap] = useState<
    Record<number, ProjectMember[]>
  >({});
  const [loadingMembers, setLoadingMembers] = useState<Record<number, boolean>>(
    {}
  );
  const [isOpen, setIsOpen] = useState(false);

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

  const handleAddProject = () => {
    // Add project logic
  };

  const handleEditProject = (project: any) => {
    // Edit project logic
  };

  const showAlert = (message: string, type: "success" | "error") => {
    Alert.alert(type === "success" ? "Success" : "Error", message);
  };

  if (semesterLoading || projectsLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0f4" />
      </View>
    );
  }

  DropDownPicker.setTheme("DARK");

  return (
    <SafeAreaView>
      <FlatList
        className="min-h-full"
        ListHeaderComponent={
          <>
            <View className="py-2">
              <Text className="text-3xl font-bold text-white">
                Supervised Projects
              </Text>
              <Text className="text-muted-foreground">
                A list of all the projects you are supervising.
              </Text>

              <View className="flex-row items-center w-full justify-between mt-4">
                <TextInput
                  style={{ borderRadius: 8 }}
                  placeholder="Search projects or members..."
                  className="bg-card w-4/6 px-4 py-2 text-white"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />

                <View style={{ width: "30%" }}>
                  <DropDownPicker
                    textStyle={{
                      fontSize: 12,
                      color: "white",
                    }}
                    open={isOpen}
                    value={selectedSemester || semesters[0]?.name}
                    items={semesters?.map((semester: { name: string }) => ({
                      label: semester.name,
                      value: semester.name,
                    }))}
                    setOpen={setIsOpen}
                    setValue={setSelectedSemester}
                    setItems={() => {}}
                    placeholder="Select Semester"
                    style={{
                      backgroundColor: "hsl(24 9.8% 10%)",
                      borderRadius: 8,
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: "hsl(24 9.8% 10%)",
                      borderRadius: 8,
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity onPress={handleAddProject}>
                <Text className="text-white">Add Project</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={filteredProjects}
        keyExtractor={(item: any) => item.project_id.toString()}
        renderItem={({ item }) => (
          <ProjectCard
            key={item.project_id}
            project={item}
            members={projectMembersMap[item.project_id]}
            // onEdit={handleEditProject}
          />
        )}
        ListEmptyComponent={
          <Text className="text-white">No projects found.</Text>
        }
        ListFooterComponent={<View className="pb-8" />}
      />
    </SafeAreaView>
  );
}
