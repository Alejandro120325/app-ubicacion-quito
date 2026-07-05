import { Router } from "express";
import {
  getGroupLocations,
  getUserLocation,
  shareLocation,
  startLocationSharing,
  stopLocationSharing,
  updateLocation
} from "../controllers/location.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/share/start", authMiddleware, startLocationSharing);
router.post("/share/stop", authMiddleware, stopLocationSharing);
router.post("/update", authMiddleware, updateLocation);
router.get("/group/:groupId", authMiddleware, getGroupLocations);
router.get("/user/:userId", authMiddleware, getUserLocation);
router.get("/:userId", authMiddleware, getUserLocation);
router.patch("/share", authMiddleware, shareLocation);

export default router;
