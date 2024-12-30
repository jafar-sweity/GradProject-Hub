import React from "react";
import { View, Text } from "react-native";
import dayjs from "dayjs";

interface Task {
  task_id: string;
  title: string;
  due_date: string;
  description?: string;
  status: string;
  priority: string;
  label: string;
  assigned_to: string;
}

interface TaskCardProps {
  task: Task;
  students: Record<string, string>;
  formatStatus: (status: Task["status"]) => string;
  formatPriority: (priority: Task["priority"]) => string;
  formatLabel: (label: Task["label"]) => string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  students,
  formatStatus,
  formatPriority,
  formatLabel,
}) => {
  return (
    <View
      key={task.task_id}
      style={{ borderRadius: 12 }}
      className="p-4 border border-muted bg-secondary shadow-md mt-2"
    >
      <View className="flex flex-row justify-between items-center mb-2">
        <Text className="font-semibold text-lg text-primary">{task.title}</Text>
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
  );
};

export default TaskCard;
