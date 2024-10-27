import express from "express";
const router = express.Router();
import {
  createSubTask,
  getSubTaskById,
  updateSubTask,
  deleteSubTask,
  getSubTasksByTaskId,
} from "../controllers/subTaskController.js";
import { authorize } from "../middleware/authorization.js";
import { checkProjectTaskPermission } from "../middleware/checkProjectTaskPermission.js";

router.post(
  "/",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  createSubTask
);
router.get(
  "/",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  getSubTasksByTaskId
);
router.get(
  "/:id",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  getSubTaskById
);
router.put(
  "/:id",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  updateSubTask
);
router.delete(
  "/:id",
  [authorize(["student", "supervisor"]), checkProjectTaskPermission()],
  deleteSubTask
);

export default router;
