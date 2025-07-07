import { Log } from "../models/Log";
import { LogActivityInput } from "./services.types";
import { ILog } from "../models/models.types";
import { getIO } from "../config/socket";
import { Types } from "mongoose";

export const logActivity = async (logData: LogActivityInput) => {
  try {
    const { user, action, targetType, targetId, details } = logData;

    const log = await Log.create({
      user,
      action,
      targetType,
      targetId,
      details,
    });
    const populated = await log.populate("user", "name email");

    const populatedUser = populated.user as {
      _id: Types.ObjectId;
      name: string;
      email: string;
    };

    getIO().emit("activity-log", {
      timestamp: new Date(populated.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      }),
      user: `${populatedUser.name} (${populatedUser.email})`,
      action:
        populated.details || `${populated.action} ${populated.targetType}`,
    });
  } catch (error) {
    console.error("Logging error:", (error as Error).message);
  }
};

export const getRecentLogs = async (limit = 20): Promise<ILog[]> => {
  return Log.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name email");
};
