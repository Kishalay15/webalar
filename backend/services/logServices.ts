import { Log } from "../models/Log";
import { LogActivityInput } from "./services.types";
import { ILog } from "../models/models.types";

export const logActivity = async (logData: LogActivityInput) => {
  try {
    const { user, action, targetType, targetId, details } = logData;
    await Log.create({ user, action, targetType, targetId, details });
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
