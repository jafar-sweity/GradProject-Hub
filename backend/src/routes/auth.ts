import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validationMiddleware.js"; // Adjust the path accordingly

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.get("/logout", logout); // You may want to add authentication middleware here

export default router;
