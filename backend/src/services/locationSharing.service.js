import { databaseService } from "./database.service.js";

export const locationSharingService = {
  setSharing: (userId, sharing) => databaseService.setUserSharing(userId, sharing),
  updateCoordinates: (data) => databaseService.saveLocation(data)
};
