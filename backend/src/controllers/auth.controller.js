import { createSimulatedToken, locations, users } from "../data/mockData.js";
import { sanitizeUser, validateRegisterPayload } from "../utils/validators.js";

export const login = (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Correo y contrasena son obligatorios."
    });
  }

  const user = users.find(
    (item) => item.email.toLowerCase() === email && item.password === password
  );

  if (!user) {
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
};

export const register = (req, res) => {
  const validation = validateRegisterPayload(req.body, users);

  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa los datos del formulario.",
      errors: validation.errors
    });
  }

  const newUser = {
    id: users.length + 1,
    ...validation.data,
    role: "persona",
    active: false,
    sharingLocation: false,
    lastConnection: "Sin conexiones recientes"
  };

  users.push(newUser);
  locations.push({
    userId: newUser.id,
    city: "Quito",
    sector: "La Mariscal",
    latitude: -0.2032,
    longitude: -78.4907,
    lastUpdate: "2026-06-21 15:50"
  });

  return res.status(201).json({
    ok: true,
    message: "Cuenta creada correctamente",
    user: sanitizeUser(newUser)
  });
};
