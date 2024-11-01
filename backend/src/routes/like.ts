import express from "express";
import {
  likePost,
  unlikePost,
  getLikesForPost,
  getLikedPostsByUser,
} from "../controllers/likeController.js";

const router = express.Router();

router.post("/:id/like", likePost);

router.delete("/:id/unlike", unlikePost);

router.get("/:id/likes", getLikesForPost);

router.get("/user/:userId/liked-posts", getLikedPostsByUser);

export default router;
