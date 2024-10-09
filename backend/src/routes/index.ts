import express from "express";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
// import projectRoutes from "./project";
// import taskRoutes from "./task";
// import subtaskRoutes from "./subTask";
// import commentRoutes from "./comment";

const router = express.Router();

router.use("/users", userRoutes);
router.use("auth", authRoutes);
// router.use("/projects", projectRoutes);
// router.use("/tasks", taskRoutes);
// router.use("/subtasks", subtaskRoutes);
// router.use("/comments", commentRoutes);

export default router;

// give me commit to the bug fix and the feature add 
