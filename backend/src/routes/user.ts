import express from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { adminMiddleware } from "../middleware/authraization.js";

const router = express.Router();

// get all users ( admin only )
router.get("/", adminMiddleware, getUsers);
// create a new user ( admin only - self registration for now )
router.post("/",createUser);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
