import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authServies";
import {
  RegisterInput,
  LoginInput,
  UserWithoutPassword,
} from "../services/services.types";

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
