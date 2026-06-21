import { getUserFromToken } from "../data/mockData.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Debes enviar un token simulado en el header Authorization."
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Token simulado invalido o expirado."
    });
  }

  req.user = user;
  req.token = token;
  next();
};
