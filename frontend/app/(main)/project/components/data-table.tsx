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
>({ columns, data }: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [editingTask, setEditingTask] = React.useState<TData | null>(null);

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

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
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
                    className="mt-1 block w-full h-24 p-2 border rounded-lg resize-none focus:ring focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="assignedTo"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Assigned To
                  </label>
                  <Input
                    id="assignedTo"
                    placeholder="Assigned To"
                    value={editingTask.assignedToName || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        assignedTo: e.target.value,
                      })
                    }
                    className="mt-1 p-2 border border-muted rounded-lg focus:ring focus:ring-primary"
                  />
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
                      onValueChange={(value) =>
                        setEditingTask({ ...editingTask, status: value })
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
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingTask(null)}
                    className="w-full md:w-auto bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/80"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => setEditingTask(null)}
                    className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/80 border border-primary"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
