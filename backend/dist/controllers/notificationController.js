var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/index.js";
import { Expo } from "expo-server-sdk";
export const registerNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, token } = req.body;
    const user = yield User.findByPk(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (Expo.isExpoPushToken(token)) {
        user.notificationToken = token;
        yield user.save();
        res.status(200).json({ message: "Notification token saved successfully" });
    }
    else {
        res.status(400).send({ error: "Invalid push token" });
    }
});
export const sendPushNotification = (notificationToken, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    const expo = new Expo();
    const messages = [
        {
            to: notificationToken,
            sound: "default",
            title,
            body,
        },
    ];
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
        yield expo.sendPushNotificationsAsync(chunk);
    }
});
export const sendNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body, userId } = req.body;
    try {
        const user = yield User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!user.notificationToken) {
            res
                .status(400)
                .json({ message: "User has not registered for notifications" });
            return;
        }
        yield sendPushNotification(user.notificationToken, title, body);
        console.log("Notification sent successfully");
        res.status(200).send({ message: "Notification sent successfully" });
    }
    catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).send({ message: "Error sending notification to user" });
    }
});
//# sourceMappingURL=notificationController.js.map