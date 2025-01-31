import express from "express";
import { getUsers, createUser, getUserById, deleteUser, updateUserCommunity, } from "../controllers/userController.js";
import { authorize } from "../middleware/authorization.js";
const router = express.Router();
// get all users ( admin only )
router.get("/", authorize(["Admin"]), getUsers);
// create a new user ( admin only - self registration for now )
router.post("/", createUser);
router.get("/:id", getUserById);
router.post("/:id", updateUserCommunity);
router.delete("/:id", deleteUser);
export default router;
//# sourceMappingURL=user.js.map