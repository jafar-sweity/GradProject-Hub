import express from "express";
import { getUserInfoByUserName } from "../controllers/userCommunityControllers.js";

const router = express.Router();
// get userinfo by user name
router.get("/:userName", getUserInfoByUserName);

export default router;
