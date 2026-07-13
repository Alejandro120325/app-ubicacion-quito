import { databaseService } from "./database.service.js";

export const authService = {
  findUserByEmail: (email) => databaseService.getUserByEmail(email),
  listUsers: () => databaseService.listUsers(),
  createUser: (data) => databaseService.createUser(data)
};
