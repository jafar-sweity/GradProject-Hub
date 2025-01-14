import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

type Member = {
  user_id: string;
  role: string;
  User: {
    name: string;
  };
};

type Project = {
  project_id: string;
  Project: {
    name: string;
    description?: string;
  };
};

type ProjectCardProps = {
  project: Project;
  members: Member[];
  supervisor?: Member | undefined;
  loading?: boolean;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  members,
  supervisor,
  loading,
}) => {
  const router = useRouter();

  return (
    <View
      key={project.project_id}
      className="mb-6 p-4 bg-card shadow-md border border-card-border -z-10"
      style={{ borderRadius: 12 }}
    >
      <Text className="text-xl font-semibold text-card-foreground">
        {project.Project.name}
      </Text>
      <Text className="text-muted-foreground mt-2">
        {project.Project.description || "No description available."}
      </Text>

      <View className="mt-4">
        {supervisor && (
          <Text className="text-foreground font-medium mb-2">Supervisor:</Text>
        )}
        <View className="flex-row flex-wrap gap-2">
          {supervisor && (
            <Text className="mb-2 px-3 py-1 rounded-full bg-green-100 text-green-800">
              {supervisor.User.name}
            </Text>
          )}
        </View>
        <Text className="text-foreground font-medium mb-2">Team Members:</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#999" />
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {members && members.length ? (
              members.map((member) => (
                <Text
                  key={member.user_id}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                >
                  {member.User.name}
                </Text>
              ))
            ) : (
              <Text className="text-muted-foreground">No members found.</Text>
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
          <Text className="text-primary-foreground">View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectCard;
