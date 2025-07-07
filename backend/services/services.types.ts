import { Types } from "mongoose";

export interface UserWithoutPassword {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: "Todo" | "In Progress" | "Done";
  priority?: "Low" | "Medium" | "High";
  assignedTo: string;
  createdBy: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: "Todo" | "In Progress" | "Done";
  priority?: "Low" | "Medium" | "High";
  assignedTo?: string;
  clientUpdatedAt: string;
}

export interface LogActivityInput {
  user: Types.ObjectId;
  action: string;
  targetType: "Task" | "User";
  targetId: Types.ObjectId;
  details?: string;
}
