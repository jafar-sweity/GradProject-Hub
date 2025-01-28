// app/dashboard/semesters/page.tsx
"use client";
import { useState } from "react";
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

type Semester = {
  name: string;
  startDate: string;
  endDate: string;
};

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { name: "Fall 2023", startDate: "2023-09-01", endDate: "2023-12-31" },
    { name: "Spring 2024", startDate: "2024-01-01", endDate: "2024-05-31" },
  ]);
  const [newSemester, setNewSemester] = useState<Semester>({
    name: "",
    startDate: "",
    endDate: "",
  });

  const handleAddSemester = () => {
    setSemesters([...semesters, newSemester]);
    setNewSemester({ name: "", startDate: "", endDate: "" });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Manage Semesters</h1>

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
            value={newSemester.startDate}
            onChange={(e) =>
              setNewSemester({ ...newSemester, startDate: e.target.value })
            }
            className="w-full sm:w-auto"
          />
          <Input
            type="date"
            value={newSemester.endDate}
            onChange={(e) =>
              setNewSemester({ ...newSemester, endDate: e.target.value })
            }
            className="w-full sm:w-auto"
          />
          <Button onClick={handleAddSemester} className="w-full sm:w-auto">
            Add Semester
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Semesters List</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters.map((semester, index) => (
              <TableRow key={index}>
                <TableCell>{semester.name}</TableCell>
                <TableCell>{semester.startDate}</TableCell>
                <TableCell>{semester.endDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
