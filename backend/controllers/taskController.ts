import { Request, Response } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  smartAssign,
} from "../services/taskServices";
import { AuthRequest } from "../middleware/middleware.types";
import { CreateTaskRequest, UpdateTaskRequest } from "./controllers.types";
import { ITask } from "../models/models.types";

export const createTaskController = async (
  req: Request,
  res: Response<ITask | { message: string }>
) => {
  try {
    const { title, description, priority, status, assignedTo } =
      req.body as CreateTaskRequest;
    const authReq = req as AuthRequest;
    const task = await createTask({
      title,
      description,
      priority,
      status,
      assignedTo,
      createdBy: authReq.user._id.toString(),
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getTasksController = async (_req: Request, res: Response) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getTaskByIdController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTaskController = async (
  req: Request<{ id: string }, {}, UpdateTaskRequest>,
  res: Response
): Promise<void> => {
  try {
    const { task, conflict } = await updateTask(req.params.id, req.body);
    if (conflict) {
      res.status(409).json({
        message: "Conflict detected",
        serverVersion: conflict.server,
        clientVersion: conflict.client,
      });
      return;
    }

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteTaskController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const deleted = await deleteTask(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const smartAssignController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const result = await smartAssign(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
