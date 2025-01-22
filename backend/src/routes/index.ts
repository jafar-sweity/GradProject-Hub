import { Router } from "express";
import userRoutes from "./user.js";
import taskRoutes from "./task.js";
import authRoutes from "./auth.js";
import projectRoutes from "./project.js";
import emailRoutes from "./email.js";
import communityRoutes from "./community.js"; // Add this line
import recommendationRoutes from "./recommendation.js"; // Add this line
import uploadRoutes from "./upload.js";
import semesterRoutes from "./semester.js";
import chatRoutes from "./chat.js";
import notificationRoutes from "./notification.js";
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
routes.use("/api/v1/upload", uploadRoutes);
// routes.use("/api/v1/projects/:projectId/tasks/:taskId/subTasks", subTaskRoutes);

// MogoDB based routes for the community feture
routes.use("/api/v1/community", communityRoutes);
routes.use("/api/v1/semesters", semesterRoutes);

// stream-chat routes
routes.use("/api/v1/chat", chatRoutes);
routes.use("/api/v1/notification", notificationRoutes);

// recommendation routes
routes.use("/api/v1/recommendations", recommendationRoutes);

export default routes;
