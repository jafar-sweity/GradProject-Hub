"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

import { labels, statuses, priorities } from "../data/data";
import { TrashIcon } from "lucide-react";
import { deleteTask, updateTask } from "@/services/tasks";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { addTask } from "@/services/tasks";
interface DataTableProps<
  TData extends {
    id: string;
    title: string;
    description?: string;
    assigned_to?: string;
    status: string;
    priority: string;
    label: string;
    assignedToName?: string;
  },
  TValue
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setTasks: React.Dispatch<React.SetStateAction<TData[]>>;
  projectId: string;
  students?: { [key: string]: string };
}

export function DataTable<
  TData extends {
    id: string;
    title: string;
    description?: string;
    assigned_to?: string;
    status: string;
    priority: string;
    label: string;
    assignedToName?: string;
  },
  TValue
>({
  columns,
  data,
  setTasks,
  projectId,
  students,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [editingTask, setEditingTask] = React.useState<TData | null>(null);
  const [newTask, setNewTask] = useState({
    id: "",
    title: "",
    description: "",
    assigned_to: "",
    status: "",
    priority: "",
    label: "",
    assignedToName: "",
    project_id: projectId,
  });
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDeleteTask(taskId: string): void {
    deleteTask(projectId, taskId)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setSnackBarMessage("Task deleted successfully.");
      })
      .catch(() => {
        setSnackBarMessage("Failed to delete task.");
      })
      .finally(() => {
        setEditingTask(null);
        setOpenSnackBar(true);
      });
  }

  function handleUpdateTask(taskId: string): void {
    updateTask(projectId, taskId, editingTask)
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId && editingTask ? editingTask : t
          )
        );
        setSnackBarMessage("Task updated successfully.");
      })
      .catch(() => {
        setSnackBarMessage("Failed to update task.");
      })
      .finally(() => {
        setEditingTask(null);
        setOpenSnackBar(true);
      });
  }

  function handleAddTask(): void {
    addTask(projectId, newTask)
      .then((task) => {
        task.id = task.task_id;
        setTasks((prevTasks) => [task, ...prevTasks]);
        setSnackBarMessage("Task added successfully.");
      })
      .catch((error) => {
        console.error("Failed to add task:", error);
        setSnackBarMessage("Failed to add task.");
      })
      .finally(() => {
        setAddTaskDialogOpen(false);
        setOpenSnackBar(true);
      });
  }
  return (
    <div className="space-y-4">
      <DataTableToolbar
        setAddTaskDialogOpen={setAddTaskDialogOpen}
        table={table}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setEditingTask(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Task Details
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Review and update the details of the selected task.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Title"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
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
                    placeholder="Description"
                    value={editingTask.description || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full h-24 p-2 border rounded-lg  focus:ring focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="assignedTo"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Assigned To
                  </label>
                  <Select
                    value={editingTask.assigned_to || ""}
                    onValueChange={(value) => {
                      setEditingTask({
                        ...editingTask,
                        assigned_to: value,
                        assignedToName: students ? students[value] : "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assigned To" />
                    </SelectTrigger>
                    <SelectContent>
                      {students &&
                        Object.entries(students).map(([id, name]) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Status
                    </label>
                    <Select
                      value={editingTask.status}
                      onValueChange={(value) => {
                        setEditingTask({ ...editingTask, status: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Priority
                    </label>
                    <Select
                      value={editingTask.priority}
                      onValueChange={(value) =>
                        setEditingTask({ ...editingTask, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem
                            key={priority.value}
                            value={priority.value}
                          >
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="label"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Label
                    </label>
                    <Select
                      value={editingTask.label}
                      onValueChange={(value) =>
                        setEditingTask({ ...editingTask, label: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Label" />
                      </SelectTrigger>
                      <SelectContent>
                        {labels.map((label) => (
                          <SelectItem key={label.value} value={label.value}>
                            {label.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Other fields (assignedTo, status, priority, label) remain unchanged */}
                <div className="flex justify-between items-center">
                  {/* Delete Button */}
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteTask(editingTask.id)}
                    className="bg-red-500 text-white hover:text-white border border-red-500 hover:bg-red-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                  <div className="space-x-2">
                    <Button
                      type="submit"
                      onClick={() => handleUpdateTask(editingTask.id)}
                      className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/80 border border-primary"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {addTaskDialogOpen && (
        <Dialog
          open={addTaskDialogOpen}
          onOpenChange={() => setAddTaskDialogOpen(false)}
        >
          <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Add New Task
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Fill in the details of the new task.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();

                  handleAddTask();
                  setAddTaskDialogOpen(false);
                  setNewTask({
                    id: "",
                    title: "",
                    description: "",
                    assigned_to: "",
                    status: "",
                    priority: "",
                    label: "",
                    assignedToName: "",
                    project_id: projectId,
                  });
                }}
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
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
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="mt-1 block w-full h-24 p-2 border rounded-lg focus:ring focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="assignedTo"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Assigned To
                  </label>
                  <Select
                    value={newTask.assigned_to}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        assigned_to: value,
                        assignedToName: students ? students[value] : "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assigned To" />
                    </SelectTrigger>
                    <SelectContent>
                      {students &&
                        Object.entries(students).map(([id, name]) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Status
                    </label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Priority
                    </label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem
                            key={priority.value}
                            value={priority.value}
                          >
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="label"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Label
                    </label>
                    <Select
                      value={newTask.label}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, label: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Label" />
                      </SelectTrigger>
                      <SelectContent>
                        {labels.map((label) => (
                          <SelectItem key={label.value} value={label.value}>
                            {label.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setAddTaskDialogOpen(false)}
                    className="bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/80"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/80 border border-primary"
                  >
                    Add Task
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
      >
        <Alert severity={"success"} variant="filled" className="w-full">
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
