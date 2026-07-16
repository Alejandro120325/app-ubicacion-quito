import { Router } from "express";
import {
  createAlert,
  deleteActivity,
  listAlerts,
  markActivityRead
} from "../controllers/activity.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, listAlerts);
router.post("/", authMiddleware, createAlert);
router.patch("/:id/read", authMiddleware, markActivityRead);
router.delete("/:id", authMiddleware, deleteActivity);

export default router;
