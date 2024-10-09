import express from "express";
import userRoutes from "./user.js";
// import projectRoutes from "./project";
// import taskRoutes from "./task";
// import subtaskRoutes from "./subTask";
// import commentRoutes from "./comment";

const router = express.Router();

router.use("/users", userRoutes);
// router.use("/projects", projectRoutes);
// router.use("/tasks", taskRoutes);
// router.use("/subtasks", subtaskRoutes);
// router.use("/comments", commentRoutes);

export default router;
