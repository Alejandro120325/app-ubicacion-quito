import { Router } from "express";
import {
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
router.patch(
  "/:groupId/members/:memberId/location-status",
  authMiddleware,
  patchGroupMemberLocationStatus
);

export default router;
