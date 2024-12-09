import express from "express";
import {
  createProjectBySupervisor,
  getProjectById,
  getProjects,
  updateProject,
  deleteProject,
  getProjectsBySupervisorId,
  addStudentToProject,
  removeStudentFromProject,
  deleteProjectBySupervisor,
  getProjectsByStudentId,
  getMemebersByProjectId,
} from "../controllers/projectController.js";
import { authorize } from "../middleware/authorization.js";
const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

router.post("/", authorize(["supervisor"]), createProjectBySupervisor);
router.delete(
  "/:projectId",
  authorize(["supervisor"]),
  deleteProjectBySupervisor
);
router.get(
  "/supervisor/:supervisorId",
  authorize(["supervisor"]),
  getProjectsBySupervisorId
);
router.get(
  "/student/:studentId",
  authorize(["student"]),
  getProjectsByStudentId
);
router.get("/:projectId/members", getMemebersByProjectId);
router.post(
  "/:projectId/students/:studentId",
  authorize(["supervisor"]),
  addStudentToProject
);
router.delete(
  "/:projectId/students/:studentId",
  authorize(["supervisor"]),
  removeStudentFromProject
);

export default router;
