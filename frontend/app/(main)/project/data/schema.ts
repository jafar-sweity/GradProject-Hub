import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  assigned_to: z.string().optional(),
  description: z.string().optional(),
  assignedToName: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;
