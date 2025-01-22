import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    students: string[];
    project_Id: string;
  }) => void;

  initialValues?: {
    name?: string;
    description?: string;
    students?: string[];
    project_id?: string;
  };
}

const ProjectDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: ProjectDialogProps) => {
  const defaultValues = {
    name: "",
    description: "",
    students: [""],
    project_id: "",
  };

  const [project_Id, setProject_Id] = useState(defaultValues.name);
  const [name, setName] = useState(defaultValues.name);
  const [description, setDescription] = useState(defaultValues.description);
  const [students, setStudents] = useState<string[]>(
    defaultValues.students || [""]
  );

  useEffect(() => {
    setProject_Id(initialValues?.project_id || "");
    setName(initialValues?.name || "");
    setDescription(initialValues?.description || "");
    setStudents(initialValues?.students || [""]);
  }, [initialValues]);

  const handleAddStudent = () => {
    setStudents((prev) => [...prev, ""]);
  };

  const handleStudentChange = (index: number, value: string) => {
    setStudents((prev) =>
      prev.map((student, i) => (i === index ? value : student))
    );
  };

  const handleRemoveStudent = (index: number) => {
    setStudents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({ name, description, students, project_Id });
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className="w-11/12 bg-card p-6 shadow-xl"
          style={{ borderRadius: 16 }}
        >
          <Text className="text-xl font-bold text-primary">
            {initialValues?.name ? "Update Project" : "Add New Project"}
          </Text>
          <Text className="text-sm text-muted-foreground mt-2">
            Fill in the details of the project.
          </Text>

          <ScrollView className="mt-4 space-y-4">
            <View>
              <Text className="text-sm font-medium text-muted-foreground">
                Project Name
              </Text>
              <TextInput
                placeholder="Enter project name"
                value={name}
                onChangeText={setName}
                className="mt-2 p-2 border text-white border-muted"
                style={{ borderRadius: 8 }}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-muted-foreground">
                Description
              </Text>
              <TextInput
                placeholder="Enter project description"
                value={description}
                onChangeText={setDescription}
                multiline
                className="mt-2 h-24 p-2 border border-muted text-white"
                style={{ borderRadius: 8 }}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-muted-foreground">
                Team Members (Emails)
              </Text>
              {students &&
                students.map((student, index) => (
                  <View
                    key={index}
                    className="flex-row items-center mt-2 space-x-2"
                  >
                    <TextInput
                      placeholder="Enter student email"
                      value={student}
                      onChangeText={(value) =>
                        handleStudentChange(index, value)
                      }
                      className="flex-1 border border-muted text-white p-2"
                      style={{ borderRadius: 8 }}
                    />
                    <TouchableOpacity
                      onPress={() => handleRemoveStudent(index)}
                      className="bg-red-500 p-2"
                      style={{ borderRadius: 8 }}
                    >
                      <Text className="text-white">Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              <TouchableOpacity
                onPress={handleAddStudent}
                className="bg-secondary mt-4 p-2"
                style={{ borderRadius: 8 }}
              >
                <Text className="text-secondary-foreground text-center">
                  Add Student
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={onClose}
                className="bg-secondary p-3"
                style={{ borderRadius: 8 }}
              >
                <Text className="text-secondary-foreground">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-primary p-3"
                style={{ borderRadius: 8 }}
              >
                <Text className="text-primary-foreground">
                  {initialValues?.name ? "Update Project" : "Add Project"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ProjectDialog;
