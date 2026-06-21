import { Router } from "express";
import {
  getLocation,
  shareLocation
} from "../controllers/location.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:userId", authMiddleware, getLocation);
router.patch("/share", authMiddleware, shareLocation);

export default router;
