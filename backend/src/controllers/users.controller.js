import { getLocationByUserId, users } from "../data/mockData.js";
import { sanitizeUser } from "../utils/validators.js";

export const getUsers = (req, res) => {
  const people = users
    .filter((user) => user.role === "persona")
    .map((user) => ({
      ...sanitizeUser(user),
      lastLocation: getLocationByUserId(user.id) || null
    }));

  return res.json({
    ok: true,
    message: "Personas simuladas obtenidas correctamente",
    users: people
  });
};

export const getMe = (req, res) => {
  return res.json({
    ok: true,
    message: "Usuario autenticado obtenido correctamente",
    user: sanitizeUser(req.user)
  });
};
