import { Request, Response } from "express";
import { SubTask } from "../models/index.js";

export const createSubTask = async (req: Request, res: Response) => {
  try {
    const subTask = await SubTask.create(req.body);
    res.status(201).json(subTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subTask = await SubTask.findByPk(id);
    if (subTask) {
      res.json(subTask);
    } else {
      res.status(404).json({ error: "SubTask not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subTask = await SubTask.findByPk(id);
    if (subTask) {
      await subTask.update(req.body);
      res.json(subTask);
    } else {
      res.status(404).json({ error: "SubTask not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subTask = await SubTask.findByPk(id);
    if (subTask) {
      await subTask.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "SubTask not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubTasksByTaskId = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const subTasks = await SubTask.findAll({ where: { task_id: taskId } });
    res.json(subTasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
