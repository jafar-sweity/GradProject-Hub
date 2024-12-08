import { Request, Response } from "express";
import User from "../models/user.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import { Op, Optional } from "sequelize";
import { NullishPropertiesOf } from "sequelize/lib/utils";
import UserCommunity from "../MongoDB/user.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      include: [Project, Task],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: (error as Error).message,
    });
  }
};

export const getUsersNotFollowed = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    // Fetch the current user's following list from MongoDB
    const currentUser = await UserCommunity.findOne(
      { user_id: userId },
      { following: 1 }
    );

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const followingIds = new Set(currentUser.following.map((f) => f.user_id));

    // Fetch all users from MongoDB except the current user
    const allUsers = await UserCommunity.find(
      { user_id: { $ne: userId } },
      { user_id: 1, avatarurl: 1 }
    );

    const notFollowedUsers = allUsers.filter(
      (user) => !followingIds.has(user.user_id)
    );

    const userIds = notFollowedUsers.map((user) => user.user_id);

    const usersFromMySQL = await User.findAll({
      where: { user_id: userIds },
      attributes: ["user_id", "name"],
    });

    const result = notFollowedUsers.map((user) => {
      const mysqlUser = usersFromMySQL.find(
        (mysqlUser) => mysqlUser.user_id === user.user_id
      );

      return {
        user_id: mysqlUser ? mysqlUser.user_id : null,
        avatarurl: user.avatarurl,
        username: mysqlUser ? mysqlUser.name : null,
      };
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error(
      "Error fetching users not followed by the current user:",
      error
    );
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
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
    } as Optional<User, NullishPropertiesOf<User>>);

    res.status(201).json(newUser);
  } catch (error: any) {
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
