import { databaseService } from "./database.service.js";

export const usersService = {
  list: () => databaseService.listUsers(),
  getById: (userId) => databaseService.getUserById(userId),
  getByEmail: (email) => databaseService.getUserByEmail(email),
  create: (data) => databaseService.createUser(data),
  update: (userId, data) => databaseService.updateUser(userId, data),
  remove: (userId) => databaseService.deleteUser(userId),
  getLastLocation: (userId) => databaseService.getUserLocation(userId)
};
