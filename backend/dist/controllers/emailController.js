var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../models/index.js";
//use Redis or a database for production
const verificationStore = {};
export const requestEmailVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    const userExists = yield User.findOne({ where: { email } });
    if (userExists) {
        res
            .status(400)
            .json({ message: "Email is already registered", success: false });
        return;
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    //10 minutes from now
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    verificationStore[email] = { code: verificationCode, expires };
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to GradProject Hub! Verify Your Email",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <div style="background-color: #1E90FF; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; font-size: 24px; margin: 0;">GradProject Hub</h1>
        </div>
        <div style="padding: 20px; background-color: #fff; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333;">Hello, ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for signing up for GradProject Hub! We're thrilled to have you on board. 
            To complete your registration, please use the verification code below:
          </p>
          <div style="background-color: #f0f4f8; border-radius: 4px; padding: 15px; text-align: center; margin: 20px 0;">
            <h2 style="color: #1E90FF; font-size: 32px; margin: 0;">${verificationCode}</h2>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">
            This code will expire in <strong>10 minutes</strong>. If you did not request this email, you can safely ignore it.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <span style="color: #1E90FF; font-weight: bold;">The GradProject Hub Team</span>
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="text-align: center; color: #777; font-size: 12px;">
            © ${new Date().getFullYear()} GradProject Hub. All rights reserved.<br>
            GradProject Hub, 123 Your Street, Your City, Your Country
          </p>
        </div>
      </div>
    `,
    };
    yield transporter.sendMail(mailOptions);
    res
        .status(200)
        .json({ message: "Verification code sent to email", success: true });
});
export const verifyEmailCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    const verificationData = verificationStore[email];
    if (!verificationData) {
        res
            .status(400)
            .json({
            message: "No verification request found for this email",
            success: false,
        });
        return;
    }
    const { code: storedCode, expires } = verificationData;
    if (new Date() > expires) {
        delete verificationStore[email];
        res
            .status(400)
            .json({ message: "Verification code has expired", success: false });
        return;
    }
    if (code !== storedCode) {
        res
            .status(400)
            .json({ message: "Invalid verification code", success: false });
        return;
    }
    delete verificationStore[email];
    res
        .status(200)
        .json({ message: "Email verified successfully", success: true });
});
//# sourceMappingURL=emailController.js.map