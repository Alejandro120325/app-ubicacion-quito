import {
  getLocationByUserId,
  updateLocationSharing,
  users
} from "../data/mockData.js";
import { sanitizeUser } from "../utils/validators.js";

export const getLocation = (req, res) => {
  const userId = Number(req.params.userId);
  const user = users.find((item) => item.id === userId);
  const location = getLocationByUserId(userId);

  if (!user || !location) {
    return res.status(404).json({
      ok: false,
      message: "No existe una ubicacion simulada para este usuario."
    });
  }

  return res.json({
    ok: true,
    message: "Ubicacion simulada obtenida correctamente",
    location: {
      ...location,
      sharing: user.sharingLocation,
      simulated: true
    }
  });
};

export const shareLocation = (req, res) => {
  const { sharing } = req.body;

  if (req.user.role !== "persona") {
    return res.status(403).json({
      ok: false,
      message: "Solo las cuentas tipo persona pueden cambiar este estado."
    });
  }

  if (typeof sharing !== "boolean") {
    return res.status(400).json({
      ok: false,
      message: "El campo sharing debe ser true o false."
    });
  }

  const updatedUser = updateLocationSharing(req.user.id, sharing);

  return res.json({
    ok: true,
    message: sharing
      ? "Uso compartido de ubicacion activado"
      : "Uso compartido de ubicacion desactivado",
    sharing,
    user: sanitizeUser(updatedUser)
  });
};
