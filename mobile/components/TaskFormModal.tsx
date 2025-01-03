import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Button } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Task {
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  label: string;
  assigned_to: string;
  assignedToName: string;
}

const statuses = ["backlog", "todo", "in progress", "done", "canceled"];
const priorities = ["high", "medium", "low"];
const labels = ["bug", "feature", "documentation"];

const TaskFormModal = ({
  editingTask,
  setEditingTask,
  taskModalVisible,
  setTaskModalVisible,
  students,
  handleSaveTask,
  handleDeleteTask,
}: any) => {
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setEditingTask((prev: Task) => ({
        ...prev,
        due_date: formattedDate,
      }));
    }
  };
  return (
    <Modal visible={taskModalVisible} animationType="fade" transparent>
      <View
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        className="flex-1 justify-center items-center"
      >
        <View
          style={{ borderRadius: 12 }}
          className="w-4/5 bg-card p-6 shadow-lg"
        >
          <Text className="text-xl font-bold mb-4 text-white">
            {editingTask ? "Edit Task" : "Add Task"}
          </Text>
          <TextInput
            placeholder="Title"
            value={editingTask?.title || ""}
            onChangeText={(text) =>
              setEditingTask((prev: Task) => ({
                ...prev,
                title: text,
              }))
            }
            style={{ borderRadius: 8 }}
            className="border p-3 rounded-md bg-secondary text-white mb-4"
          />
          <TextInput
            placeholder="Description"
            value={editingTask?.description || ""}
            onChangeText={(text) =>
              setEditingTask((prev: Task) => ({
                ...prev,
                description: text,
              }))
            }
            style={{ borderRadius: 8 }}
            className="border p-3 rounded-md bg-secondary text-white mb-4"
          />
          <Text className="text-lg text-white font-semibold mb-2">
            Due Date
          </Text>

          <DateTimePicker
            value={
              editingTask?.due_date
                ? new Date(editingTask.due_date)
                : new Date()
            }
            onChange={handleDateChange}
            mode="date"
          />
          <Text className="text-lg text-white font-semibold my-2">Status</Text>
          <FlatList
            data={statuses}
            horizontal
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setEditingTask((prev: Task) => ({
                    ...prev,
                    status: item,
                  }))
                }
                className={`p-2 rounded-full mx-1 ${
                  editingTask?.status === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700"
                }`}
              >
                <Text className="text-white capitalize">{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Text className="text-lg text-white font-semibold mb-2 mt-4">
            Priority
          </Text>
          <FlatList
            data={priorities}
            horizontal
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setEditingTask((prev: Task) => ({
                    ...prev,
                    priority: item,
                  }))
                }
                className={`p-2 rounded-full mx-1 ${
                  editingTask?.priority === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700"
                }`}
              >
                <Text className="text-white capitalize">{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Text className="text-lg text-white font-semibold mb-2 mt-4">
            Label
          </Text>
          <FlatList
            data={labels}
            horizontal
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setEditingTask((prev: Task) => ({
                    ...prev,
                    label: item,
                  }))
                }
                className={`p-2 rounded-full mx-1 ${
                  editingTask?.label === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700"
                }`}
              >
                <Text className="text-white capitalize">{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Text className="text-xl font-bold text-white my-4">Assigned To</Text>
          <FlatList
            data={Object.entries(students)}
            horizontal
            keyExtractor={(item) => item[0]}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setEditingTask((prev: any) => ({
                    ...prev,
                    assigned_to: item[0],
                    assignedToName: item[1],
                  }));
                }}
                className={`p-2 rounded-full mx-1 ${
                  students[editingTask?.assigned_to] === item[1]
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700"
                }`}
              >
                <Text className="text-white">{item[1] as string}</Text>
              </TouchableOpacity>
            )}
          />
          <View className="flex justify-between items-center flex-row">
            <Button
              onPress={handleSaveTask}
              mode="contained"
              className="bg-green-600 mt-4 "
              style={{ borderRadius: 8 }}
            >
              Save Task
            </Button>
            {editingTask && (
              <Button
                onPress={handleDeleteTask}
                mode="contained"
                style={{
                  borderRadius: 8,
                }}
                className="bg-red-600 mt-4"
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  size={17}
                  color="white"
                  style={{ marginRight: 8 }}
                />
              </Button>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setTaskModalVisible(false)}
            className="absolute top-2 right-2 p-2"
          >
            <FontAwesomeIcon icon={faTimesCircle} size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskFormModal;
