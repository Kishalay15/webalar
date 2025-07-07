import { CreateTaskInput, UpdateTaskInput } from "./services.types";
import { ITask, IUser } from "../models/models.types";
import { Task } from "../models/Task";
import { logActivity } from "./logServices";
import { Types } from "mongoose";
import { getIO } from "../config/socket";
import { User } from "../models/User";

export const createTask = async (taskData: CreateTaskInput): Promise<ITask> => {
  const task = (await Task.create(taskData)) as ITask & {
    _id: Types.ObjectId;
    createdBy: Types.ObjectId;
  };
  if (task) {
    await logActivity({
      user: task.createdBy as Types.ObjectId,
      action: "created",
      targetType: "Task",
      targetId: task._id as Types.ObjectId,
      details: `Created task "${task.title}"`,
    });

    getIO().emit("task-created", task);
  }

  return task;
};

export const getAllTasks = async (): Promise<ITask[]> => {
  return await Task.find().populate("assignedTo", "name email");
};

export const getTaskById = async (id: string): Promise<ITask | null> => {
  return await Task.findById(id);
};

export const updateTask = async (
  id: string,
  updates: UpdateTaskInput
): Promise<{ task?: ITask; conflict?: { server: ITask; client: any } }> => {
  const task = await Task.findById(id);
  if (!task) throw new Error("Task not found");

  const clientTime = new Date(updates.clientUpdatedAt);
  const serverTime = new Date(task.updatedAt);

  if (clientTime < serverTime) {
    return {
      conflict: {
        server: task,
        client: updates,
      },
    };
  }

  const updated = await Task.findByIdAndUpdate(id, updates, { new: true });
  if (updated) {
    await logActivity({
      user: updated.createdBy as Types.ObjectId,
      action: "updated",
      targetType: "Task",
      targetId: updated._id as Types.ObjectId,
      details: `Updated task "${updated.title}"`,
    });

    getIO().emit("task-updated", updated);
  }

  return { task: updated || undefined };
};

export const deleteTask = async (id: string): Promise<ITask | null> => {
  const deleted = await Task.findByIdAndDelete(id);
  if (deleted) {
    await logActivity({
      user: deleted.createdBy as Types.ObjectId,
      action: "deleted",
      targetType: "Task",
      targetId: deleted._id as Types.ObjectId,
      details: `Deleted task "${deleted.title}"`,
    });

    getIO().emit("task-deleted", deleted);
  }

  return deleted;
};

export const smartAssign = async (taskId: string): Promise<ITask> => {
  const allUsers = (await User.find()) as IUser[];
  const tasks = await Task.find({ status: { $ne: "Done" } });
  const taskCounts = new Map<string, number>();

  tasks.forEach((task) => {
    const uid = task.assignedTo.toString();

    taskCounts.set(uid, (taskCounts.get(uid) || 0) + 1);
  });

  let targetUser: IUser | null = null;
  let minCount = Infinity;

  for (const user of allUsers) {
    const count = taskCounts.get(user._id.toString()) || 0;
    if (count < minCount) {
      targetUser = user;
      minCount = count;
    }
  }

  if (!targetUser) {
    throw new Error("No users available for assignment");
  }

  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  task.assignedTo = targetUser._id;
  await task.save();

  await logActivity({
    user: task.createdBy as Types.ObjectId,
    action: "assigned",
    targetType: "Task",
    targetId: task._id as Types.ObjectId,
    details: `Smart assigned to ${targetUser.name}`,
  });

  getIO().emit("task-updated", task);

  return task;
};
