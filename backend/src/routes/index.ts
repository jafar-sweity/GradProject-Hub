import express from "express";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
// import projectRoutes from "./project";
// import taskRoutes from "./task";
// import subtaskRoutes from "./subTask";
// import commentRoutes from "./comment";

const routes = express.Router();
routes.use("/api/v1/users", userRoutes);
routes.use("/api/v1/auth", authRoutes);
// routes.use("/api/v1/projects", projectRoutes);
// routes.use("/api/v1/tasks", taskRoutes);
// routes.use("/api/v1/subtasks", subtaskRoutes);
// routes.use("/api/v1/comments", commentRoutes);

export default routes;
