"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Define types
type Semester = {
  name: string;
  startDate: string;
  endDate: string;
};

type Project = {
  id: number;
  name: string;
  type: "software" | "hardware";
  semester: string;
};

type Supervisor = {
  id: number;
  name: string;
};

type Student = {
  id: number;
  name: string;
};

function AdminDashboard() {
  // State with TypeScript types
  const [semesters, setSemesters] = useState<Semester[]>([
    { name: "Fall 2023", startDate: "2023-09-01", endDate: "2023-12-31" },
    { name: "Spring 2024", startDate: "2024-01-01", endDate: "2024-05-31" },
  ]);

  // Data with TypeScript types
  const projects: Project[] = [
    { id: 1, name: "Project A", type: "software", semester: "Fall 2023" },
    { id: 2, name: "Project B", type: "hardware", semester: "Fall 2023" },
    { id: 3, name: "Project C", type: "software", semester: "Spring 2024" },
  ];

  const supervisors: Supervisor[] = [
    { id: 1, name: "Dr. Smith" },
    { id: 2, name: "Dr. Johnson" },
  ];

  const students: Student[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  // Derived data
  const projectCount = projects.length;
  const hardwareProjects = projects.filter((p) => p.type === "hardware").length;
  const softwareProjects = projects.filter((p) => p.type === "software").length;
  const supervisorCount = supervisors.length;
  const studentCount = students.length;

  const projectTypeData = [
    { name: "Hardware", value: hardwareProjects },
    { name: "Software", value: softwareProjects },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="p-8 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Projects</h2>
          <p className="text-2xl">{projectCount}</p>
        </div>
        <div className="p-4 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold">Hardware Projects</h2>
          <p className="text-2xl">{hardwareProjects}</p>
        </div>
        <div className="p-4 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold">Software Projects</h2>
          <p className="text-2xl">{softwareProjects}</p>
        </div>
        <div className="p-4 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold">Supervisors</h2>
          <p className="text-2xl">{supervisorCount}</p>
        </div>
        <div className="p-4 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-2xl">{studentCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-4 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Project Type Distribution
          </h2>
          <PieChart width={400} height={300}>
            <Pie
              data={projectTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {projectTypeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="p-4 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Projects per Semester</h2>
          <BarChart
            width={400}
            height={300}
            data={semesters.map((semester) => ({
              name: semester.name,
              projects: projects.filter((p) => p.semester === semester.name)
                .length,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="projects" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
