import { Router } from "express";
import {
  geocode,
  getMapsStatus,
  isoline,
  places,
  reverse,
  routing
} from "../controllers/maps.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/status", getMapsStatus);
router.get("/geocode", authMiddleware, geocode);
router.get("/reverse", authMiddleware, reverse);
router.get("/routing", authMiddleware, routing);
router.get("/places", authMiddleware, places);
router.get("/isoline", authMiddleware, isoline);

export default router;
