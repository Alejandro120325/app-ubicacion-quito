import { Router } from "express";
import {
  deleteStoredLocation,
  getGroupLocations,
  getStoredLocation,
  getUserLocation,
  listLocations,
  patchStoredLocation,
  patchUserLocationStatus,
  postLocation
} from "../controllers/locations.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, listLocations);
router.post("/", authMiddleware, postLocation);
router.get("/group/:groupId", authMiddleware, getGroupLocations);
router.get("/user/:userId", authMiddleware, getUserLocation);
router.patch("/user/:userId/status", authMiddleware, patchUserLocationStatus);
router.get("/:id", authMiddleware, getStoredLocation);
router.patch("/:id", authMiddleware, patchStoredLocation);
router.delete("/:id", authMiddleware, deleteStoredLocation);

export default router;
