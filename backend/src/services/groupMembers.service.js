import { databaseService } from "./database.service.js";

export const groupMembersService = {
  list: (groupId) => databaseService.listMembers(groupId),
  create: (groupId, data) => databaseService.addMember(groupId, data),
  update: (groupId, memberId, data) => databaseService.updateMember(groupId, memberId, data),
  remove: (groupId, memberId) => databaseService.deleteMember(groupId, memberId)
};
