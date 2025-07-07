import { Router } from "express";
import {
  registerController,
  loginController,
  getAllUsersController,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/users", protect, getAllUsersController);

export default router;
