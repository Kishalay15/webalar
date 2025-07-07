import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  getTasksController,
  updateTaskController,
  smartAssignController,
} from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router
  .route("/")
  .get(protect, getTasksController)
  .post(protect, createTaskController);

router
  .route("/:id")
  .get(protect, getTaskByIdController)
  .put(protect, updateTaskController)
  .delete(protect, deleteTaskController);

router.post("/:id/smart-assign", protect, smartAssignController);

export default router;
