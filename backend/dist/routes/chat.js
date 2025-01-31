var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// routes/chat.js
import { Router } from "express";
import { StreamChat } from "stream-chat";
const router = Router();
// Initialize Stream Chat client
const serverClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY, process.env.STREAM_SECRET);
// Token generation endpoint
router.get("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        console.log("Calling get-token for user:", userId);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Set token expiration times
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
        const issuedAt = Math.floor(Date.now() / 1000) - 60; // Issued a minute ago
        // Generate token
        const token = serverClient.createToken(String(userId), expirationTime, issuedAt);
        console.log("Token generated:", token);
        res.json({ token });
        return;
    }
    catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}));
export default router;
//# sourceMappingURL=chat.js.map