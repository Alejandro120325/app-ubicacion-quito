import { Router } from "express";
import {
  getAuthenticatedUser,
  login,
  register
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, getAuthenticatedUser);

export default router;
