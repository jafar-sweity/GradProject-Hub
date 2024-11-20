import { Router } from "express";
import userRoutes from "./user.js";
import taskRoutes from "./task.js";
import authRoutes from "./auth.js";
import projectRoutes from "./project.js";
import emailRoutes from "./email.js";
import communityRoutes from "./community.js"; // Add this line
// import subTaskRoutes from "./subTask.js";
const routes = Router();

routes.get("/", (req, res) => {
  res.send("Server is running");
});
routes.use("/api/v1/auth", authRoutes);

routes.use("/api/v1/users", userRoutes);
routes.use("/api/v1/projects", projectRoutes);
routes.use("/api/v1/projects/:projectId/tasks", taskRoutes);
routes.use("/api/v1/emails", emailRoutes);
// routes.use("/api/v1/projects/:projectId/tasks/:taskId/subTasks", subTaskRoutes);

// MogoDB based routes for the community feture
routes.use("/api/v1/community", communityRoutes);
export default routes;
