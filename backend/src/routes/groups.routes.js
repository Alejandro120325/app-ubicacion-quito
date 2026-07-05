import { Router } from "express";
import {
  deleteGroupMember,
  getGroup,
  getGroups,
  patchGroupMemberLocationStatus,
  postGroup,
  postGroupMember
} from "../controllers/groups.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getGroups);
router.post("/", authMiddleware, postGroup);
router.get("/:groupId", authMiddleware, getGroup);
router.post("/:groupId/members", authMiddleware, postGroupMember);
router.delete("/:groupId/members/:userId", authMiddleware, deleteGroupMember);
router.patch(
  "/:groupId/members/:memberId/location-status",
  authMiddleware,
  patchGroupMemberLocationStatus
);

export default router;
