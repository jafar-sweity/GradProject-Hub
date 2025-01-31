var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { StreamClient } from "@stream-io/node-sdk";
import nodemailer from "nodemailer";
import { sendPushNotification } from "../controllers/notificationController.js";
import User from "../models/user.js";
const router = express.Router();
const apiKey = process.env.API_GETSTREAM_PUBLISHABLE_KEY;
const secret = process.env.API_GETSTREAM_SECRET_KEY;
if (!apiKey || !secret) {
    throw new Error("API_GETSTREAM_PUBLISHABLE_KEY and API_GETSTREAM_SECRET_KEY must be defined");
}
const client = new StreamClient(apiKey, secret);
router.post("/generateUserToken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, name, image, email } = req.body;
    const newUser = {
        id: userId.toString(),
        role: "user",
        name,
        image,
        custom: {
            email,
        },
    };
    yield client.upsertUsers([newUser]);
    const validity = 60 * 60 * 24;
    const token = client.generateUserToken({
        user_id: userId,
        validity_in_seconds: validity,
    });
    res.status(200).json({ token });
}));
router.post("/sendScheduleMeetingInfo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emails, meetingDate, roomId, meetingCreator } = req.body;
    if (!emails || !Array.isArray(emails) || !meetingDate || !roomId) {
        res.status(400).json({ error: "Invalid input data" });
        return;
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const emailTemplate = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #121212; background-color: #fff; padding: 20px; border-radius: 8px;">
  <div style="text-align: center; padding: 20px; background-color: #1E90FF; border-radius: 8px 8px 0 0;">
    <h1 style="color: #fff; font-size: 24px; margin: 0;">Meeting Scheduled</h1>
  </div>
  <div style="padding: 20px;">
    <h2 style="color: #1E90FF; font-size: 20px;">Hello!</h2>
    <p style="font-size: 16px; line-height: 1.6;">
      You have a meeting scheduled by <strong style="color: #1E90FF;">${meetingCreator}</strong> on <strong style="color: #1E90FF;">${new Date(meetingDate).toLocaleString()}</strong>.
    </p>
    <p style="font-size: 16px; line-height: 1.6;">
      Please use the following Room ID to join the meeting:
    </p>
    <div style="color: #1E1E1E; border-radius: 4px; padding: 15px; text-align: center; margin: 20px 0;">
      <h2 style="color: #1E90FF; font-size: 32px; margin: 0;">${roomId}</h2>
    </div>
    <p style="font-size: 16px; line-height: 1.6;">
      Make sure to join on time. If you have any questions, feel free to reach out.
    </p>
    <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
      Best regards,<br>
      <span style="color: #1E90FF; font-weight: bold;">GradProject-Hub Team</span>
    </p>
    <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;">
    <p style="text-align: center; color: #777; font-size: 12px;">
      © ${new Date().getFullYear()} GradProject-Hub. All rights reserved.<br>
      123 Meeting Street, Your City, Your Country
    </p>
  </div>
</div>
`;
    try {
        for (const email of emails) {
            const user = yield User.findOne({ where: { email } });
            if (user === null || user === void 0 ? void 0 : user.notificationToken) {
                yield sendPushNotification(user.notificationToken, "Meeting Scheduled", `You have a meeting scheduled by ${meetingCreator} on ${new Date(meetingDate).toLocaleString()}.`);
            }
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Meeting Scheduled",
                html: emailTemplate,
            };
            yield transporter.sendMail(mailOptions);
        }
        res.status(200).json({ message: "Emails sent successfully" });
    }
    catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ error: "Failed to send emails" });
    }
}));
export default router;
//# sourceMappingURL=meeting.js.map