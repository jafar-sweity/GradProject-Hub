import express from "express";
import postRoutes from "./post.js";
import commentRoutes from "./comment.js";
import followerRoutes from "./follow.js";
import likeRoutes from "./like.js";

const router = express.Router();

router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/followers", followerRoutes);
router.use("/likes", likeRoutes);

// // routes.use("/api/v1/messages", messageRoutes);

export default router;
