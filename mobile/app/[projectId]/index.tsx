import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { getProjectTasks } from "@/services/tasks";
import { getProjectMembers } from "@/services/project";
import dayjs from "dayjs";
import useFetchData from "@/hooks/useFetchData";
import { Button, IconButton } from "react-native-paper";

interface Task {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  status: "backlog" | "todo" | "in progress" | "done" | "canceled";
  priority: "high" | "low" | "medium";
  label: "bug" | "feature" | "documentation";
  assigned_to: string;
  assignedToName?: string;
}

const TasksScreen = () => {
  const { projectId } = useLocalSearchParams() as {
    projectId: string;
  };

  const { data: tasks, loading: tasksLoading } = useFetchData(getProjectTasks, [
    projectId,
  ]) as any;

  const { data: projectMembers, loading: projectMembersLoading } = useFetchData(
    getProjectMembers,
    [projectId]
  ) as any;

  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePriority, setVisiblePriority] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    return tasksArray.filter((task: Task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority =
        !selectedPriority || task.priority === selectedPriority;
      const matchesStatus = !selectedStatus || task.status === selectedStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, selectedPriority, selectedStatus]);

  const { students, supervisors } = useMemo(() => {
    const students: Record<string, string> = {};
    const supervisors: Record<string, string> = {};
    if (!projectMembersLoading && projectMembers) {
      projectMembers.forEach((member: any) => {
        if (member.role === "student") {
          students[member.user_id] = member.User.name;
        } else if (member.role === "supervisor") {
          supervisors[member.user_id] = member.User.name;
        }
      });
    }
    return { students, supervisors };
  }, [projectMembers, projectMembersLoading]);

  const formatStatus = (status: Task["status"]) => {
    const colorMap = {
      backlog: "text-gray-500 bg-gray-100",
      todo: "text-blue-500 bg-blue-100",
      "in progress": "text-yellow-500 bg-yellow-100",
      done: "text-green-500 bg-green-100",
      canceled: "text-red-500 bg-red-100",
    };
    return colorMap[status] || "text-gray-500 bg-gray-100";
  };

  const formatPriority = (priority: Task["priority"]) => {
    const colorMap = {
      high: "text-red-500 bg-red-100",
      medium: "text-yellow-500 bg-yellow-100",
      low: "text-green-500 bg-green-100",
    };
    return colorMap[priority] || "text-gray-500 bg-gray-100";
  };

  const formatLabel = (label: Task["label"]) => {
    const colorMap = {
      bug: "text-red-500 bg-red-100",
      feature: "text-blue-500 bg-blue-100",
      documentation: "text-purple-500 bg-purple-100",
    };
    return colorMap[label] || "text-gray-500 bg-gray-100";
  };

  const priorities = ["High", "Medium", "Low"];
  const statuses = ["Backlog", "Todo", "In Progress", "Done", "Canceled"];

  const handleSelectPriority = (value: string) => {
    setSelectedPriority(value);
    setVisiblePriority(false);
  };

  const handleSelectStatus = (value: string) => {
    setSelectedStatus(value);
    setVisibleStatus(false);
  };

  return (
    <ScrollView className="flex-1 p-4 bg-card">
      {tasksLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="hsl(142.1 70.6% 45.3%)" />
        </View>
      ) : (
        <View className="flex-1 space-y-6">
          <View className="flex flex-col space-y-4">
            <View>
              <Text className="text-2xl font-bold tracking-tight text-foreground">
                Welcome back!
              </Text>
            </View>
            <View className="space-y-1">
              <Text className="text-muted-foreground text-sm">
                Your Supervisor(s):{" "}
                {Object.values(supervisors).join(", ") || "None"}
              </Text>
              <Text className="text-muted-foreground text-sm">
                Project Members: {Object.values(students).join(", ") || "None"}
              </Text>
            </View>
            <View className="space-y-2">
              <TextInput
                style={{ borderRadius: 8 }}
                className="p-2 border  bg-secondary text-foreground"
                placeholder="Search tasks by name or description..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <View className="flex-1 p-4 bg-gray-100">
                {/* Selected Priority */}
                <View className="mb-6">
                  <Text className="text-xl font-bold mb-2">
                    Selected Priority:
                  </Text>
                  <Text className="text-lg text-blue-600">
                    {selectedPriority || "None"}
                  </Text>
                </View>

                {/* Selected Status */}
                <View className="mb-6">
                  <Text className="text-xl font-bold mb-2">
                    Selected Status:
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => console.log("Pressed")}
                  >
                    {selectedStatus || "None"}
                  </Button>
                </View>

                {/* Priority Icon Button */}
                <IconButton
                  icon="priority-high"
                  size={30}
                  iconColor="#fff"
                  onPress={() => setVisiblePriority(true)}
                  className="absolute bottom-24 right-4 bg-blue-600 p-3 rounded-full"
                />

                {/* Status Icon Button */}
                <IconButton
                  icon="check-circle"
                  size={30}
                  iconColor="#fff"
                  onPress={() => setVisibleStatus(true)}
                  className="absolute bottom-14 right-4 bg-green-600 p-3 rounded-full"
                />

                {/* Priority Modal */}
                <Modal
                  visible={visiblePriority}
                  animationType="fade"
                  transparent={true}
                  onRequestClose={() => setVisiblePriority(false)}
                >
                  <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white rounded-lg p-6 w-4/5 max-h-80 overflow-auto">
                      <Text className="text-xl font-semibold mb-4">
                        Select Priority
                      </Text>
                      <FlatList
                        data={priorities}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleSelectPriority(item)}
                            className="p-3 border-b border-gray-200"
                          >
                            <Text className="text-lg text-blue-600">
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                      <Button
                        mode="contained"
                        onPress={() => setVisiblePriority(false)}
                        className="mt-4"
                      >
                        Close
                      </Button>
                    </View>
                  </View>
                </Modal>

                {/* Status Modal */}
                <Modal
                  visible={visibleStatus}
                  animationType="fade"
                  transparent={true}
                  onRequestClose={() => setVisibleStatus(false)}
                >
                  <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white rounded-lg p-6 w-4/5 max-h-80 overflow-auto">
                      <Text className="text-xl font-semibold mb-4">
                        Select Status
                      </Text>
                      <FlatList
                        data={statuses}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleSelectStatus(item)}
                            className="p-3 border-b border-gray-200"
                          >
                            <Text className="text-lg text-green-600">
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                      <Button
                        mode="contained"
                        onPress={() => setVisibleStatus(false)}
                        className="mt-4"
                      >
                        Close
                      </Button>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          </View>

          {filteredTasks?.length ? (
            <View className="space-y-4">
              {filteredTasks.map((task: Task) => (
                <View
                  key={task.task_id}
                  style={{ borderRadius: 12 }}
                  className="p-4 border border-muted bg-secondary shadow-md"
                >
                  <View className="flex flex-row justify-between items-center mb-2">
                    <Text className="font-semibold text-lg text-primary">
                      {task.title}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Due: {dayjs(task.due_date).format("MMM DD, YYYY")}
                    </Text>
                  </View>
                  <Text className="text-sm text-muted-foreground">
                    {task.description || "No description available."}
                  </Text>
                  <View className="flex flex-row flex-wrap mt-2 space-x-2">
                    <Text
                      className={`text-xs px-2 py-1 rounded-full ${formatStatus(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </Text>
                    <Text
                      className={`text-xs px-2 py-1 rounded-full ${formatPriority(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </Text>
                    <Text
                      className={`text-xs px-2 py-1 rounded-full ${formatLabel(
                        task.label
                      )}`}
                    >
                      {task.label}
                    </Text>
                  </View>
                  <Text className="text-xs mt-2 text-muted-foreground">
                    Assigned To: {students[task.assigned_to] || "Unassigned"}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-center text-muted-foreground">
              No tasks found.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default TasksScreen;
