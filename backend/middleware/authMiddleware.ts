import jwt from "jsonwebtoken";
import { Response, NextFunction, Request } from "express";
import { User } from "../models/User";
import { AuthRequest } from "./middleware.types";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const jwt_secret = process.env.JWT_SECRET;

  if (!jwt_secret) {
    throw new Error("jwt_secret not set in environment");
  }

  try {
    const decoded = jwt.verify(token, jwt_secret) as { id: string };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    (req as AuthRequest).user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
