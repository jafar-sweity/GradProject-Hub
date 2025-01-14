import { Request, Response } from "express";
import { User } from "../models/index.js";
import { Expo } from "expo-server-sdk";

export const registerNotification = async (req: Request, res: Response) => {
  const { userId, token } = req.body;
  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (Expo.isExpoPushToken(token)) {
    user.notificationToken = token;
    await user.save();
    res.status(200).json({ message: "Notification token saved successfully" });
  } else {
    res.status(400).send({ error: "Invalid push token" });
  }
};

export const sendNotification = async (req: Request, res: Response) => {
  const { title, body, userId } = req.body;
  const user = await User.findByPk(userId);
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

  const expo = new Expo();
  const messages = [
    {
      to: user.notificationToken,
      sound: "default",
      title,
      body,
    },
  ];
  const chunks = expo.chunkPushNotifications(messages);

  setTimeout(async () => {
    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
        console.log("Notification sent successfully");

        res.status(200).send({ message: "Notification sent successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error sending notification to user" });
      }
    }
  }, 15000);
};
