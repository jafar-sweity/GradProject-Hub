import express from "express";
import postRoutes from "./post.js";
import commentRoutes from "./comment.js";
import followerRoutes from "./follow.js";
import likeRoutes from "./like.js";
import userCommunityRoutes from "./userCommunity.js";
const router = express.Router();
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/followers", followerRoutes);
router.use("/likes", likeRoutes);
router.use("/users", userCommunityRoutes);
// BookMark
// // routes.use("/api/v1/messages", messageRoutes);
export default router;
//# sourceMappingURL=community.js.map