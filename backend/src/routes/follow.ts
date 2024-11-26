import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/followController.js";
import { authorize } from "../middleware/authorization.js"; // Assuming you have an authentication middleware
import {
  getUsers,
  getUsersNotFollowed,
} from "../controllers/userController.js";

const router = express.Router();
// get the users i dont follow
router.get("/users/notfollow", getUsersNotFollowed);
router.post("/follow/:id", authorize(["user"]), followUser);

router.post("/unfollow/:id", authorize(["user"]), unfollowUser);

router.get("/:id/followers", authorize(["user"]), getFollowers);

router.get("/:id/following", authorize(["user"]), getFollowing);

// get user that i dont follow use this function getUsersNotFollowed
router.get("/users", authorize(["user"]), getUsers);

export default router;
