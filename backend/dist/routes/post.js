import express from "express";
import { createPost, getPosts, getPostById, updatePost, deletePost, getForYouPosts, getFollowingPosts, addBookmark, removeBookmark, getBookmarkedPosts, Search, } from "../controllers/postController.js";
const router = express.Router();
router.post("/", createPost);
router.get("/", getPosts);
// for you posts api
router.get("/forYou", getForYouPosts);
router.get("/following", getFollowingPosts);
// bookmark
router.post("/:id/bookmark", addBookmark);
router.delete("/:id/bookmark", removeBookmark);
router.get("/:userId/bookmarked", getBookmarkedPosts);
router.get("/search", Search);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
export default router;
//# sourceMappingURL=post.js.map