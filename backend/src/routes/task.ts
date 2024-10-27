import express from "express";
const router = express.Router();
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProjectId,
} from "../controllers/taskController.js";
import { authorize } from "../middleware/authorization.js";
import { checkProjectTaskPermission } from "../middleware/checkProjectTaskPermission.js";

router.post(
  "/",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  createTask
);
router.get(
  "/",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  getTasksByProjectId
);
router.get(
  "/:id",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  getTaskById
);
router.put(
  "/:id",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  updateTask
);
router.delete(
  "/:id",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  deleteTask
);

export default router;
