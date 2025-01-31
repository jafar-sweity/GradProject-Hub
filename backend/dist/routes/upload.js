import express from "express";
import { storeUrl, deleteUrl } from "../controllers/uploadController.js";
const router = express.Router();
router.put("/url", storeUrl);
router.delete("/url", deleteUrl);
export default router;
//# sourceMappingURL=upload.js.map