"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [students, setStudents] = useState(defaultValues.students);

  useEffect(() => {
    if (initialValues) {
      setProject_Id(initialValues.project_id || "");
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setStudents(initialValues.students || [""]);
    }
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
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setName(defaultValues.name);
        setDescription(defaultValues.description);
        setStudents(defaultValues.students);
        onClose();
      }}
    >
      <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            {initialValues?.name ? "Update Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details of the project.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-muted-foreground"
            >
              Project Name
            </label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border border-muted rounded-lg focus:ring focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-muted-foreground"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full h-24 p-2 border rounded-lg focus:ring focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Team Members (Emails)
            </label>
            {students.map((student, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  placeholder="Enter student email"
                  value={student}
                  onChange={(e) => handleStudentChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => handleRemoveStudent(index)}
                  className="text-red-500"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={handleAddStudent}
              className="mt-2 bg-secondary text-secondary-foreground"
            >
              Add Student
            </Button>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-secondary text-secondary-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground"
            >
              {initialValues?.name ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
