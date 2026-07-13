import { Router } from "express";
import {
  deleteUser,
  getMe,
  getUser,
  getUsers,
  patchUser,
  postUser
} from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.post("/", authMiddleware, postUser);
router.get("/me", authMiddleware, getMe);
router.get("/:id", authMiddleware, getUser);
router.patch("/:id", authMiddleware, patchUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
