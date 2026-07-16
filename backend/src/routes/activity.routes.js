import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  listActivity,
  listActivityByGroup,
  listActivityByUser,
  markActivityRead
} from "../controllers/activity.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, listActivity);
router.post("/", authMiddleware, createActivity);
router.get("/user/:userId", authMiddleware, listActivityByUser);
router.get("/group/:groupId", authMiddleware, listActivityByGroup);
router.patch("/:id/read", authMiddleware, markActivityRead);
router.delete("/:id", authMiddleware, deleteActivity);

export default router;
