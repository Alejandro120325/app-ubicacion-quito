import { TOKEN_PREFIX } from "../data/mockData.js";
import { databaseService } from "../services/database.service.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Debes enviar un token simulado en el header Authorization."
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const userId =
    token === TOKEN_PREFIX
      ? 1
      : token.startsWith(`${TOKEN_PREFIX}-`)
        ? Number(token.replace(`${TOKEN_PREFIX}-`, ""))
        : null;

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(401).json({
      ok: false,
      message: "Token simulado invalido o expirado."
    });
  }

  try {
    const user = await databaseService.getUserById(userId);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Token simulado invalido o expirado."
      });
    }
    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    return next(error);
  }
};
