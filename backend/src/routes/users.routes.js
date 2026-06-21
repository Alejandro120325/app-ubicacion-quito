import { Router } from "express";
import { getMe, getUsers } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.get("/me", authMiddleware, getMe);

export default router;
