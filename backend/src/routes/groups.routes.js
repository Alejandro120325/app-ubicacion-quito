import { Router } from "express";
import {
  deleteGroupMember,
  getGroupMembers,
  leaveGroup,
  patchGroupMember,
  patchGroupMemberLocationStatus,
  postGroupMember
} from "../controllers/groupMembers.controller.js";
import {
  deleteGroup,
  getGroup,
  getGroups,
  patchGroup,
  postGroup
} from "../controllers/groups.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getGroups);
router.post("/", authMiddleware, postGroup);
router.get("/:groupId", authMiddleware, getGroup);
router.patch("/:groupId", authMiddleware, patchGroup);
router.delete("/:groupId", authMiddleware, deleteGroup);
router.get("/:groupId/members", authMiddleware, getGroupMembers);
router.post("/:groupId/members", authMiddleware, postGroupMember);
router.delete("/:groupId/members/me", authMiddleware, leaveGroup);
router.patch("/:groupId/members/:memberId", authMiddleware, patchGroupMember);
router.delete("/:groupId/members/:memberId", authMiddleware, deleteGroupMember);
router.patch(
  "/:groupId/members/:memberId/location-status",
  authMiddleware,
  patchGroupMemberLocationStatus
);

export default router;
