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
  Button,
} from "react-native";
import ProjectCard from "@/components/ProjectCard";
import { useAuth } from "@/hooks/useAuth";
import useFetchData from "@/hooks/useFetchData";
import { getProjectMembers } from "@/services/project";
import {
  addProject,
  getSupervisorProjects,
  updateProject,
} from "@/services/supervisorProjects";
import { getSemesters } from "@/services/semester";
import { sendNotification } from "@/services/notification";
import DropDownPicker from "react-native-dropdown-picker";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import ProjectDialog from "@/components/ProjectDialog";
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

  const {
    data: projectsData,
    loading: projectsLoading,
    refetch,
  } = useFetchData(getSupervisorProjects, [
    user?.id ?? "",
    selectedSemester ?? "",
  ]);

  const projects = Array.isArray(projectsData) ? projectsData : [];

  const [projectMembersMap, setProjectMembersMap] = useState<
    Record<number, ProjectMember[]>
  >({});
  const [loadingMembers, setLoadingMembers] = useState<Record<number, boolean>>(
    {}
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [refetchProjectMembers, setRefetchProjectMembers] = useState(false);
  useEffect(() => {
    projects.forEach((project: any) => {
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
        .catch((error) => {
          console.log("Error getting project members:", error);
        })
        .finally(() => {
          setLoadingMembers((prev) => ({
            ...prev,
            [project.project_id]: false,
          }));
        });
    });
  }, [refetchProjectMembers, projects, isDialogOpen]);

  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

  useEffect(() => {
    const filtered = projects?.filter((project: any) => {
      const projectName = project.Project?.name?.toLowerCase() || "";
      const members = projectMembersMap[project.project_id] || [];
      const memberNames = members
        ?.map((member) => member.User?.name?.toLowerCase())
        .join(" ");

      return (
        projectName.includes(searchQuery.toLowerCase()) ||
        memberNames.includes(searchQuery.toLowerCase())
      );
    });
    setFilteredProjects(filtered);
  }, [projects, projectMembersMap, searchQuery]);

  if (semesterLoading || projectsLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0f4" />
      </View>
    );
  }

  const handleAddProject = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    const members = projectMembersMap[project.project_id] || [];
    const memberNames = members?.map((member) => member.User?.email);

    setIsDialogOpen(true);
    setEditingProject({
      project_id: project.project_id,
      name: project.Project.name,
      description: project.Project.description,
      students: memberNames,
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
        setRefetchProjectMembers((prev) => !prev);
        // console.log(data.students);

        // setProjectMembersMap((prev) => {
        //   const updatedMembers = prev[editingProject.project_id].filter(
        //     (member) => {
        //       return data.students.includes(member.User.email);
        //     }
        //   );
        //   return {
        //     ...prev,
        //     [editingProject.project_id]: updatedMembers,
        //   };
        // });
        Alert.alert("Project updated successfully!");
      } else {
        await addProject(data);
        Alert.alert("New project added successfully!");
      }
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      console.log("Error adding project:", error);
      Alert.alert("An error occurred while updating the projects.");
    }
  };

  DropDownPicker.setTheme("DARK");

  return (
    <SafeAreaView>
      <View>
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
              </View>
            </>
          }
          data={filteredProjects}
          keyExtractor={(item: any) => item.project_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="-z-10"
              onPress={() => handleEditProject(item)}
            >
              <ProjectCard
                key={item.project_id}
                project={item}
                members={projectMembersMap[item.project_id]}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-white">No projects found.</Text>
          }
          ListFooterComponent={<View className="pb-8" />}
        />
        <TouchableOpacity
          onPress={handleAddProject}
          className="bg-primary bottom-16 right-5 rounded-full flex-row absolute items-center justify-center px-5 py-4"
        >
          <FontAwesomeIcon name="plus" size={20} color="white" />
        </TouchableOpacity>
        <ProjectDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          onSubmit={handleDialogSubmit}
          initialValues={editingProject}
        />
      </View>
    </SafeAreaView>
  );
}
