import epxress from "express";
import {
  registerNotification,
  sendNotification,
} from "../controllers/notificationController.js";

const router = epxress.Router();

router.post("/register-token", registerNotification);
router.post("/send-notification", sendNotification);
export default router;
