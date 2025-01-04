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
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getProjectTasks } from "@/services/tasks";
import { getProjectMembers } from "@/services/project";
import useFetchData from "@/hooks/useFetchData";
import { Button } from "react-native-paper";
import TaskCard from "../../components/TaskCardComponent";
import filter from "@/assets/images/filter.png";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import TaskFormModal from "../../components/TaskFormModal";
import { deleteTask, updateTask, addTask } from "@/services/tasks";

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
  project_id: string;
}

const TasksScreen = () => {
  const { projectId } = useLocalSearchParams() as {
    projectId: string;
  };

  const {
    data: tasks,
    loading: tasksLoading,
    refetch: refetchTasks,
  } = useFetchData(getProjectTasks, [projectId]) as any;

  const { data: projectMembers, loading: projectMembersLoading } = useFetchData(
    getProjectMembers,
    [projectId]
  ) as any;

  const [searchQuery, setSearchQuery] = useState("");
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const filteredTasks = useMemo(() => {
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    return tasksArray.filter((task: Task) => {
      const assignedToName = students[task.assigned_to] || "";

      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (assignedToName &&
          assignedToName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority =
        !selectedPriority || task.priority === selectedPriority;
      const matchesStatus = !selectedStatus || task.status === selectedStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, selectedPriority, selectedStatus, students]);

  const formatStatus = (status: string): string => {
    const colorMap: Record<Task["status"], string> = {
      backlog: "text-gray-500 bg-gray-100",
      todo: "text-blue-500 bg-blue-100",
      "in progress": "text-yellow-500 bg-yellow-100",
      done: "text-green-500 bg-green-100",
      canceled: "text-red-500 bg-red-100",
    };
    return colorMap[status as Task["status"]] || "text-gray-500 bg-gray-100";
  };

  const formatPriority = (priority: string): string => {
    const colorMap: Record<Task["priority"], string> = {
      high: "text-red-500 bg-red-100",
      medium: "text-yellow-500 bg-yellow-100",
      low: "text-green-500 bg-green-100",
    };
    return (
      colorMap[priority as Task["priority"]] || "text-gray-500 bg-gray-100"
    );
  };

  const formatLabel = (label: string) => {
    const colorMap: Record<Task["label"], string> = {
      bug: "text-red-500 bg-red-100",
      feature: "text-blue-500 bg-blue-100",
      documentation: "text-purple-500 bg-purple-100",
    };
    return colorMap[label as Task["label"]] || "text-gray-500 bg-gray-100";
  };

  const priorities = ["high", "medium", "low"];
  const statuses = ["backlog", "todo", "in Progress", "done", "canceled"];

  const renderDropdownItem = (
    item: string,
    isSelected: boolean,
    toggleFunc: (item: string) => void
  ) => {
    return (
      <TouchableWithoutFeedback onPress={() => toggleFunc(item)} key={item}>
        <View
          className={`flex-row justify-between items-center p-2 rounded-sm ${
            isSelected ? "bg-blue-500" : "bg-card"
          }`}
        >
          <Text className="text-foreground">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
          {isSelected && (
            <FontAwesomeIcon name="check" size={15} color="blue" />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderFilters = (
    filters: string[],
    toggleFunc: (filter: string) => void
  ) => {
    return filters.map((filter, index) => (
      <View
        key={index}
        className="flex-row-reverse items-center mx-1 rounded-full px-3 py-1 border border-gray-50"
      >
        <Text className="text-gray-50">
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </Text>
        <TouchableOpacity
          className="mr-2 mb-0.5"
          onPress={() => toggleFunc(filter)}
        >
          <Text className="text-xs text-gray-50 p-0.5 pr-2 ">X</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskModalVisible(true);
  };

  const handleUpdateTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalVisible(true);
  };

  const handleDeleteTask = () => {
    if (editingTask && editingTask.task_id) {
      deleteTask(projectId, editingTask.task_id)
        .then(() => {
          Alert.alert("Success", "Task deleted successfully.");
          refetchTasks();
        })
        .catch(() => {
          Alert.alert("Error", "Failed to delete task.");
        });
      setTaskModalVisible(false);
    } else {
      Alert.alert("Error", "No task to delete");
    }
  };

  const handleSaveTask = () => {
    if (editingTask) {
      if (editingTask.task_id) {
        updateTask(projectId, editingTask.task_id, editingTask)
          .then(() => {
            Alert.alert("Success", "Task updated successfully.");
            refetchTasks();
          })
          .catch(() => {
            Alert.alert("Error", "Failed to update task.");
          });
      } else {
        editingTask.project_id = projectId;
        addTask(projectId, editingTask)
          .then((task) => {
            task.id = task.task_id;
            Alert.alert("Success", "Task added successfully.");
            refetchTasks();
          })
          .catch((error) => {
            console.error("Failed to add task:", error.response.data);
            Alert.alert("Error", "Failed to add task.");
          });
      }
      setTaskModalVisible(false);
    } else {
      Alert.alert("Error", "Add at least a title to save the task.");
    }
    setTaskModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f0f0", position: "relative" }}>
      <ScrollView className="flex-1 p-4 bg-background">
        {tasksLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="hsl(142.1 70.6% 45.3%)" />
          </View>
        ) : (
          <View className="flex-1 space-y-6">
            <View className="flex-1 flex-col space-y-4 relative">
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
                  Project Members:{" "}
                  {Object.values(students).join(", ") || "None"}
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity onPress={() => setFiltersModalVisible(true)}>
                  <Image
                    source={filter}
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: "#ddd",
                      marginRight: 8,
                    }}
                  />
                </TouchableOpacity>
                <TextInput
                  style={{ borderRadius: 8 }}
                  className="p-2 border  bg-card text-foreground flex-grow"
                  placeholder="Search tasks by name, description or student name"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
            <View className="flex-row flex-wrap my-2">
              {renderFilters(
                [selectedPriority, selectedStatus].filter(
                  (item): item is string => item !== null
                ),
                (filter) => {
                  if (filter === selectedPriority) setSelectedPriority(null);
                  if (filter === selectedStatus) setSelectedStatus(null);
                }
              )}
            </View>

            {filteredTasks?.length ? (
              <View className="space-y-4">
                {filteredTasks.map((task: Task) => (
                  <TouchableOpacity
                    key={task.task_id}
                    onPress={() => handleUpdateTask(task)}
                  >
                    <TaskCard
                      key={task.task_id}
                      task={task}
                      students={students}
                      formatStatus={formatStatus}
                      formatPriority={formatPriority}
                      formatLabel={formatLabel}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-center text-muted-foreground">
                No tasks found.
              </Text>
            )}
          </View>
        )}

        <Modal visible={filtersModalVisible} animationType="slide" transparent>
          <View
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            className="flex-1 justify-center items-center"
          >
            <View className="w-4/5 bg-card  p-4 " style={{ borderRadius: 12 }}>
              <Text className="text-xl font-bold mb-4 text-foreground">
                Choose Filters
              </Text>

              <Text className="my-2 text-lg font-bold text-foreground">
                Priority
              </Text>
              {priorities.map((priority) =>
                renderDropdownItem(
                  priority,
                  priority === selectedPriority,
                  setSelectedPriority
                )
              )}

              <Text className="my-2 text-lg font-bold text-foreground">
                Status
              </Text>
              {statuses.map((status) =>
                renderDropdownItem(
                  status,
                  status === selectedStatus,
                  setSelectedStatus
                )
              )}

              <View className="mt-3">
                <Button
                  onPress={() => setFiltersModalVisible(false)}
                  mode="contained"
                  className="bg-primary"
                >
                  Apply Filters
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <TaskFormModal
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          taskModalVisible={taskModalVisible}
          setTaskModalVisible={setTaskModalVisible}
          students={students}
          handleSaveTask={handleSaveTask}
          handleDeleteTask={handleDeleteTask}
        />
      </ScrollView>
      <TouchableOpacity
        onPress={handleAddTask}
        className="bg-primary bottom-24 right-5 rounded-full flex-row absolute items-center justify-center px-5 py-4"
      >
        <FontAwesomeIcon name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TasksScreen;
