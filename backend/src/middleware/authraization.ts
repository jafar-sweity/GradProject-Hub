// check the authrization by check the token in the cookie
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// check the role of the user
// export const checkRole = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     if (decoded.role !== "admin") {
//       res.status(403).json({ message: "Forbidden" });
//       return;
//     }
//     res.status(200).json(decoded);
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };
