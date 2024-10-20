// Routes/index.ts
import { Router } from "express";
import userRoutes from "./user.js";
// import projectRoutes from "./projectRoutes";
// import taskRoutes from "./taskRoutes";
// import messageRoutes from "./messageRoutes";
// import postRoutes from "./postRoutes";
// import commentRoutes from "./commentRoutes";
// import mentorshipRoutes from "./mentorshipRoutes";
import authRoutes from "./auth.js"; // Import authRoutes

const routes = Router();

// Mount routes
// test the server
routes.get("/", (req, res) => {
  res.send("Server is running");
});
routes.use("/api/v1/auth", authRoutes); // Mount authRoutes

routes.use("/api/v1/users", userRoutes);

// routes.use("/api/v1/projects", projectRoutes);
// routes.use("/api/v1/tasks", taskRoutes);
// routes.use("/api/v1/messages", messageRoutes);
// routes.use("/api/v1/posts", postRoutes);
// routes.use("/api/v1/comments", commentRoutes);
// routes.use("/api/v1/mentorships", mentorshipRoutes);

export default routes;
