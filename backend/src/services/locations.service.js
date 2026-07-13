import { databaseService } from "./database.service.js";

export const locationsService = {
  list: (user) => databaseService.listLocations(user),
  getById: (locationId) => databaseService.getLocationById(locationId),
  getByUser: (userId) => databaseService.getUserLocation(userId),
  getByGroup: (groupId) => databaseService.getGroupLocations(groupId),
  save: (data) => databaseService.saveLocation(data),
  update: (locationId, data) => databaseService.updateLocation(locationId, data),
  remove: (locationId) => databaseService.deleteLocation(locationId)
};
