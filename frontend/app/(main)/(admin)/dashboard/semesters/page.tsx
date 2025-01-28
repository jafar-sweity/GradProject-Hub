"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSemesters,
  updateSemester,
  createSemester,
  deleteSemester,
} from "@/services/semester";
import useFetchData from "@/hooks/useFetchData";

type Semester = {
  semester_id?: string;
  name: string;
  start_date: string;
  end_date: string;
};

export default function SemestersPage() {
  const { data: semestersData, loading } = useFetchData(getSemesters, []);

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [newSemester, setNewSemester] = useState<Semester>({
    name: "",
    start_date: "",
    end_date: "",
  });
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);

  useEffect(() => {
    if (semestersData) setSemesters(semestersData);
  }, [semestersData]);

  const handleAddSemester = async () => {
    try {
      const createdSemester = await createSemester(newSemester);
      setSemesters([...semesters, createdSemester]);
      setNewSemester({ name: "", start_date: "", end_date: "" });
    } catch (error) {
      console.error("Failed to create semester:", error);
    }
  };

  const handleUpdateSemester = async () => {
    if (!editingSemester) return;
    try {
      const updatedSemester = await updateSemester({
        ...editingSemester,
        semester_id: editingSemester.semester_id!,
      });
      setSemesters(
        semesters.map((semester) =>
          semester.semester_id === updatedSemester.semester_id
            ? updatedSemester
            : semester
        )
      );
      setEditingSemester(null);
    } catch (error) {
      console.error("Failed to update semester:", error);
    }
  };

  const handleDeleteSemester = async (semester_id: string) => {
    try {
      await deleteSemester(semester_id);
      setSemesters(
        semesters.filter((semester) => semester.semester_id !== semester_id)
      );
    } catch (error: any) {
      console.error(
        "Failed to delete semester:",
        error?.response?.data?.message
      );
    }
  };

  if (loading)
    return (
      <div className="w-full flex justify-center">
        <span className="loading loading-dots loading-lg bg-primary"></span>
      </div>
    );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Manage Semesters</h1>

      {/* Add Semester Form */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Add Semester</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Semester Name"
            value={newSemester.name}
            onChange={(e) =>
              setNewSemester({ ...newSemester, name: e.target.value })
            }
            className="w-full sm:w-auto flex-grow"
          />
          <Input
            type="date"
            value={newSemester.start_date}
            onChange={(e) =>
              setNewSemester({ ...newSemester, start_date: e.target.value })
            }
            className="w-full sm:w-auto"
          />
          <Input
            type="date"
            value={newSemester.end_date}
            onChange={(e) =>
              setNewSemester({ ...newSemester, end_date: e.target.value })
            }
            className="w-full sm:w-auto"
          />
          <Button onClick={handleAddSemester} className="w-full sm:w-auto">
            Add Semester
          </Button>
        </div>
      </div>

      {/* Edit Semester Form (Conditional Rendering) */}
      {editingSemester && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Edit Semester</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Semester Name"
              value={editingSemester.name}
              onChange={(e) =>
                setEditingSemester({
                  ...editingSemester,
                  name: e.target.value,
                })
              }
              className="w-full sm:w-auto flex-grow"
            />
            <Input
              type="date"
              value={editingSemester.start_date}
              onChange={(e) =>
                setEditingSemester({
                  ...editingSemester,
                  start_date: e.target.value,
                })
              }
              className="w-full sm:w-auto"
            />
            <Input
              type="date"
              value={editingSemester.end_date}
              onChange={(e) =>
                setEditingSemester({
                  ...editingSemester,
                  end_date: e.target.value,
                })
              }
              className="w-full sm:w-auto"
            />
            <Button onClick={handleUpdateSemester} className="w-full sm:w-auto">
              Update Semester
            </Button>
            <Button
              variant="destructive"
              onClick={() => setEditingSemester(null)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Semesters List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Semesters List</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters.map((semester) => (
              <TableRow key={semester.semester_id}>
                <TableCell>{semester.name}</TableCell>
                <TableCell>
                  {new Date(semester.start_date).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell>
                  {new Date(semester.end_date).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setEditingSemester(semester)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleDeleteSemester(semester.semester_id!)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
