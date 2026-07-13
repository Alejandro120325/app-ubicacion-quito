import { createSimulatedToken } from "../data/mockData.js";
import { authService } from "../services/auth.service.js";
import { databaseService } from "../services/database.service.js";
import { sanitizeUser, validateRegisterPayload } from "../utils/validators.js";

const legacyEmailAliases = {
  "admin@quitoapp.com": "admin@geokipu.com",
  "persona@quitoapp.com": "persona@geokipu.com"
};

export const login = async (req, res, next) => {
  const requestedEmail = req.body.email?.trim().toLowerCase();
  const email = legacyEmailAliases[requestedEmail] || requestedEmail;
  const password = req.body.password || "";

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Correo y contrasena son obligatorios."
    });
  }

  try {
    const user = await authService.findUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas. Revisa el correo y la contrasena."
      });
    }

    return res.json({
      ok: true,
      message: "Inicio de sesion correcto",
      token: createSimulatedToken(user.id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const existingUsers = await authService.listUsers();
    const requestedEmail = req.body.email?.trim().toLowerCase();
    const validation = validateRegisterPayload(
      {
        ...req.body,
        email: legacyEmailAliases[requestedEmail] || requestedEmail
      },
      existingUsers
    );

    if (!validation.isValid) {
      return res.status(400).json({
        ok: false,
        message: "Revisa los datos del formulario.",
        errors: validation.errors
      });
    }

    const newUser = await authService.createUser({
      ...validation.data,
      role: "persona",
      active: false,
      sharingLocation: false,
      lastConnection: new Date().toISOString()
    });

    return res.status(201).json({
      ok: true,
      message: "Cuenta creada correctamente",
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    return next(error);
  }
};

export const getAuthenticatedUser = (req, res) => {
  return res.json({
    ok: true,
    message: "Usuario autenticado obtenido correctamente",
    storage: databaseService.mode,
    user: sanitizeUser(req.user)
  });
};
