import express from "express";
import {
  createProject,
  getProjectById,
  getProjects,
  updateProject,
  deleteProject,
  getProjectsBySupervisorId,
  // addStudentToProject,
  // removeStudentFromProject,
} from "../controllers/projectController.js";
import { authorize } from "../middleware/authorization.js";
const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.get("/supervisor/:supervisorId", getProjectsBySupervisorId);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);
// router.post(
//   "/:projectId/users/:userId",
//   authorize(["Supervisor"]),
//   addStudentToProject
// );
// router.delete(
//   "/:projectId/users/:userId",
//   authorize(["Supervisor"]),
//   removeStudentFromProject
// );

export default router;
