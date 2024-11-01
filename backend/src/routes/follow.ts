import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/followController.js";
import { authorize } from "../middleware/authorization.js"; // Assuming you have an authentication middleware

const router = express.Router();

router.post("/follow/:id", authorize(["user"]), followUser);

router.post("/unfollow/:id", authorize(["user"]), unfollowUser);

router.get("/:id/followers", authorize(["user"]), getFollowers);

router.get("/:id/following", authorize(["user"]), getFollowing);

export default router;
