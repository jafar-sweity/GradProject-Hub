import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedToken;
  }
}
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string;

interface DecodedToken {
  role: string;
}

export const authorize = (roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Authorization token is missing" });
      return;
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

      if (roles.includes(decoded.role)) {
        req.user = decoded;
        next();
      } else {
        res
          .status(403)
          .json({ error: "Access denied: insufficient permissions" });
        return;
      }
      res.status(403).json({ error: "Invalid token" });
      return;
    } catch (error) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
  };
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Access denied: insufficient permissions" });
    return;
  }
  next();
}