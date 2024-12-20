import express from "express";

import {
  createSemester,
  getSemesterById,
  getSemesters,
  updateSemester,
  deleteSemester,
} from "../controllers/semesterController.js";

const router = express.Router();

router.get("/", getSemesters);

router.get("/:id", getSemesterById);

router.post("/", createSemester);

router.patch("/:id", updateSemester);

router.delete("/:id", deleteSemester);

export default router;
