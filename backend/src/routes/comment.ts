import express from "express";
import {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);

router.get("/post/:postId", getCommentsByPost);

router.get("/:id", getCommentById);

router.put("/:id", updateComment);

router.delete("/:id", deleteComment);

export default router;
