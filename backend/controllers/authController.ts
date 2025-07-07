import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authServies";
import {
  RegisterInput,
  LoginInput,
  UserWithoutPassword,
} from "../services/services.types";
import { User } from "../models/User";

export const registerController = async (req: Request, res: Response) => {
  try {
    const input: RegisterInput = req.body;
    const newUser: UserWithoutPassword = await registerUser(input);

    res.status(201).json(newUser);
  } catch (error: unknown) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const input: LoginInput = req.body;
    const existingUser: UserWithoutPassword = await loginUser(input);

    res.status(200).json(existingUser);
  } catch (error: unknown) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({}, "_id name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
