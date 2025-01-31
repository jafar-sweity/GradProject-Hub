import express from "express";
import { requestEmailVerification, verifyEmailCode, } from "../controllers/emailController.js";
const router = express.Router();
router.post("/requestEmailVerification", requestEmailVerification);
router.post("/verifyEmailCode", verifyEmailCode);
export default router;
//# sourceMappingURL=email.js.map