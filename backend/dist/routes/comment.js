import express from "express";
import { createComment, getCommentsByPost, getCommentById, updateComment, deleteComment, } from "../controllers/commentController.js";
const router = express.Router();
router.post("/post/:postId", createComment);
router.get("/post/:postId", getCommentsByPost);
router.delete("/:id", deleteComment);
router.get("/:id", getCommentById);
router.put("/:id", updateComment);
export default router;
//# sourceMappingURL=comment.js.map