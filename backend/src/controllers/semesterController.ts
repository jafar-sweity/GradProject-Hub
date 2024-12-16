import { Semester } from "../models/index.js";
import { Request, Response } from "express";

export const getSemesters = async (req: Request, res: Response) => {
  try {
    const semesters = await Semester.findAll();
    res.status(200).json(semesters);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getSemesterById = async (req: Request, res: Response) => {
  try {
    const semester = await Semester.findByPk(req.params.id);
    if (semester) {
      res.status(200).json(semester);
    } else {
      res.status(404).json({ message: "Semester not found" });
    }
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createSemester = async (req: Request, res: Response) => {
  try {
    const semester = await Semester.create(req.body);
    res.status(201).json(semester);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSemester = async (req: Request, res: Response) => {
  try {
    const semester = await Semester.findByPk(req.params.id);
    if (semester) {
      await semester.update(req.body);
      res.status(200).json(semester);
    } else {
      res.status(404).json({ message: "Semester not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSemester = async (req: Request, res: Response) => {
  try {
    const semester = await Semester.findByPk(req.params.id);
    if (semester) {
      await semester.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Semester not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
