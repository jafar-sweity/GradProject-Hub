import express from "express";
import postRoutes from "./post.js";
import commentRoutes from "./comment.js";
import followerRoutes from "./follow.js";
import likeRoutes from "./like.js";

const router = express.Router();

router.use("/api/v1/posts", postRoutes);

router.use("/api/v1/comments", commentRoutes);
router.use("/api/v1/followers", followerRoutes);
router.use("/api/v1/likes", likeRoutes);

// // routes.use("/api/v1/messages", messageRoutes);

export default router;
