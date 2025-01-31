var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;
export const authorize = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ error: "Authorization token is missing" });
            return;
        }
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            if (decoded.role && roles.includes(decoded.role)) {
                req.user = decoded;
                next();
                return;
            }
            else {
                res
                    .status(403)
                    .json({ error: "Access denied: insufficient permissions" });
                return;
            }
        }
        catch (error) {
            res.status(403).json({ error: "Invalid token" });
            return;
        }
    });
};
//# sourceMappingURL=authorization.js.map