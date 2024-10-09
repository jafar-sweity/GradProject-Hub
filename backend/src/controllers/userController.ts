import { Request, Response } from "express";
import User from "../models/user.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      include: [Project, Task],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [Project, Task],
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
