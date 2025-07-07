import { Router } from "express";
import { getLogsController } from "../controllers/logController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getLogsController);

export default router;
