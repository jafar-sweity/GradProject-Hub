import { Request, Response } from "express";
import User from "../models/user.js"; 
import UserCommunity from "../MongoDB/user.js"; 
import { Optional } from "sequelize";
import { NullishPropertiesOf } from "sequelize/lib/utils";
import validator from "validator";
const { isEmail } = validator;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate token
const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// User registration
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // need transaction here
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    } as Optional<User, NullishPropertiesOf<User>>);

    const newUserCommunity = new UserCommunity({
      user_id: newUser.user_id, // Reference to MySQL user_id
    });
    await newUserCommunity.save();

    const payload = {
      id: newUser.user_id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };

    // Ensure you are using the correct user ID field
    const token = generateToken(payload);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.user_id, name: newUser.name, role: newUser.role },
      token,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// User login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid password" });
    return;
  }

  const payload = {
    id: user.user_id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const token = generateToken(payload); // Ensure you are using the correct user ID field
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    user: { id: user.user_id, name: user.name, role: user.role },
    token,
  });
};

// User logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
