import { Request, Response } from "express";
import User from "../models/user.js";
import { Optional } from "sequelize";
import { NullishPropertiesOf } from "sequelize/lib/utils";
import { isEmail } from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

// generate token

const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!isEmail(email)) {
      res.status(400).json({ message: "Invalid email" });
      return;
    }
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
    } as Optional<User, NullishPropertiesOf<User>>);

    res.status(201).json(newUser);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(400).json({ message: "Invalid password" });
    return;
  }

  // generate token
  const token = generateToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "Login successful" });
  // dont forget to check the usr status is active or not ......... 
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
