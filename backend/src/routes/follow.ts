import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowerInfo,
} from "../controllers/followController.js";
import {
  getUsers,
  getUsersNotFollowed,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users/notfollow", getUsersNotFollowed);

router.post("/follow/:id", followUser);
router.post("/unfollow/:id", unfollowUser);

router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);
router.get("/:userId", getFollowerInfo); // Updated to include `userId` in the path

router.get("/users", getUsers);

export default router;
