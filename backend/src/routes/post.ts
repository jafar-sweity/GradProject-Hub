import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getForYouPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost);

router.get("/", getPosts);
// for you posts api
router.get("/forYou", getForYouPosts);

router.get("/:id", getPostById);

router.put("/:id", updatePost);

router.delete("/:id", deletePost);

export default router;
