import { databaseService } from "./database.service.js";

export const groupsService = {
  list: (user) => databaseService.listGroups(user),
  getById: (groupId) => databaseService.getGroup(groupId),
  create: (data) => databaseService.createGroup(data),
  update: (groupId, data) => databaseService.updateGroup(groupId, data),
  remove: (groupId) => databaseService.deleteGroup(groupId)
};
