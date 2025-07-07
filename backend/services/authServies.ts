import { IUser } from "../models/models.types";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import {
  RegisterInput,
  UserWithoutPassword,
  LoginInput,
} from "./services.types";
import { Types } from "mongoose";

export const registerUser = async (
  data: RegisterInput
): Promise<UserWithoutPassword> => {
  const { name, email, password } = data;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  try {
    const newUser = (await User.create({ name, email, password })) as IUser & {
      _id: Types.ObjectId;
    };

    const userWithoutPassword: UserWithoutPassword = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id.toString()),
    };

    return userWithoutPassword;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User registration failed");
  }
};

export const loginUser = async (
  data: LoginInput
): Promise<UserWithoutPassword> => {
  const { email, password } = data;

  try {
    const user = (await User.findOne({ email })) as IUser & {
      _id: Types.ObjectId;
    };
    if (!user || !(await user.matchPassword(password))) {
      throw new Error("Invalid email or password");
    }

    const userWithoutPassword: UserWithoutPassword = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    };

    return userWithoutPassword;
  } catch (error) {
    console.error("Error signing in user:", error);
    throw new Error("User login failed");
  }
};
