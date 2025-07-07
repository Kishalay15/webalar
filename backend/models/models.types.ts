import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILog extends Document {
  user:
    | Types.ObjectId
    | {
        _id: Types.ObjectId;
        name: string;
        email: string;
      };
  action: string;
  targetType: "Task" | "User";
  targetId: Types.ObjectId;
  details?: string;
  createdAt: Date;
}
