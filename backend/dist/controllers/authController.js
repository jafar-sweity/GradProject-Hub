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
import UserCommunity from "../MongoDB/user.js";
import validator from "validator";
const { isEmail } = validator;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// Generate token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
// User registration
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const userExists = yield User.findOne({ where: { email } });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt.hash(password, 10);
        // need transaction here
        const newUser = yield User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        const newUserCommunity = new UserCommunity({
            user_id: newUser.user_id, // Reference to MySQL user_id
            username: newUser.name,
        });
        yield newUserCommunity.save();
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error creating user", error: error.message });
    }
});
// User login
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Find user by email
    const user = yield User.findOne({ where: { email } });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    // Validate password
    const isPasswordValid = yield bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid password" });
        return;
    }
    // get moingo user id that have the above user_id
    const user_id = Number(user.user_id); // Ensure this is a number
    const userCommunity = yield UserCommunity.findOne({ user_id });
    const payload = {
        id: user.user_id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatarurl: user.avatarurl,
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
        user: {
            id: user.user_id,
            name: user.name,
            role: user.role,
            avatarurl: user.avatarurl,
        },
        token,
    });
});
// User logout
export const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
});
//# sourceMappingURL=authController.js.map