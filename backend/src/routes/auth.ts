import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import requestValidator from "../middleware/requestValidator.js";
import loginSchema from "../validators/loginValidator.js";
import registrationSchema from "../validators/registrationValidator.js";
const router = express.Router();

router.post("/register", requestValidator(registrationSchema), register);
router.post("/login", requestValidator(loginSchema), login);
router.get("/logout", logout); // You may want to add authentication middleware here

export default router;
