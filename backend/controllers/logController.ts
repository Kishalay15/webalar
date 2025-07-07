import { Request, Response } from "express";
import { getRecentLogs } from "../services/logServices";

export const getLogsController = async (_req: Request, res: Response) => {
  try {
    const rawLogs = await getRecentLogs();

    const formattedLogs = rawLogs.map((log) => {
      const user = log.user as { name: string; email: string };

      return {
        timestamp: new Date(log.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
        user: `${user.name} (${user.email})`,
        action: log.details || `${log.action} ${log.targetType}`,
      };
    });

    res.status(200).json(formattedLogs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
