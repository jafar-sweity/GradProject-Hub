var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import UserCommunity from "../MongoDB/user.js";
export const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.findAll({
            include: [Project, Task],
        });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message,
        });
    }
});
export const getUsersNotFollowed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        if (!userId) {
            res.status(400).json({ message: "userId is required" });
            return;
        }
        // Fetch the current user's following list from MongoDB
        const currentUser = yield UserCommunity.findOne({ user_id: userId }, { following: 1 });
        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const followingIds = new Set(currentUser.following.map((f) => f.user_id));
        // Fetch all users from MongoDB except the current user
        const allUsers = yield UserCommunity.find({ user_id: { $ne: userId } }, { user_id: 1, avatarurl: 1 });
        const notFollowedUsers = allUsers.filter((user) => !followingIds.has(user.user_id));
        const userIds = notFollowedUsers.map((user) => user.user_id);
        const usersFromMySQL = yield User.findAll({
            where: { user_id: userIds },
            attributes: ["user_id", "name"],
        });
        const result = notFollowedUsers.map((user) => {
            const mysqlUser = usersFromMySQL.find((mysqlUser) => mysqlUser.user_id === user.user_id);
            return {
                user_id: mysqlUser ? mysqlUser.user_id : null,
                avatarurl: user.avatarurl,
                username: mysqlUser ? mysqlUser.name : null,
            };
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching users not followed by the current user:", error);
        res
            .status(500)
            .json({ message: "Error fetching users", error: error.message });
    }
});
export const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const newUser = yield User.create({
            name,
            email,
            password,
            role,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error creating user", error: error.message });
    }
});
export const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User.findByPk(id, {
            include: [Project, Task],
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const user = yield User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        user.role = role || user.role;
        yield user.save();
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});
export const updateUserCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // The `user_id` from the route parameter
        const { avatarurl, username, bio } = req.body;
        // Find the user by their unique `user_id` and update
        const currentUser = yield UserCommunity.findOneAndUpdate({ user_id: id }, { avatarurl: avatarurl, username, bio }, { new: true });
        const updatedUser = yield User.update({ avatarurl: avatarurl }, { where: { user_id: id } });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Respond with the updated user data
        res.status(200).json(currentUser);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});
export const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        yield user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});
//# sourceMappingURL=userController.js.map