import {
  getGroupById,
  getLocationByUserId,
  getLocationsByGroupId,
  getVisibleGroups,
  updateLocationSharing,
  updateLiveLocation,
  users
} from "../data/mockData.js";
import { sanitizeUser, validateLocationPayload } from "../utils/validators.js";

const canAccessGroup = (user, group) =>
  user.role === "admin" ||
  group.createdBy === user.id ||
  group.members.some(
    (member) => member.userId === user.id || member.email === user.email
  );

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
      simulated: location.simulated ?? true
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

export const startLocationSharing = (req, res) => {
  req.body.sharing = true;
  return shareLocation(req, res);
};

export const stopLocationSharing = (req, res) => {
  req.body.sharing = false;
  return shareLocation(req, res);
};

export const updateLocation = (req, res) => {
  if (req.user.role !== "persona") {
    return res.status(403).json({
      ok: false,
      message: "Solo una cuenta tipo persona puede compartir su ubicacion."
    });
  }

  if (!req.user.sharingLocation) {
    return res.status(409).json({
      ok: false,
      message: "Activa Compartir ubicacion antes de enviar coordenadas."
    });
  }

  const validation = validateLocationPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa las coordenadas enviadas.",
      errors: validation.errors
    });
  }

  if (validation.data.groupId) {
    const group = getGroupById(validation.data.groupId);
    if (!group || !canAccessGroup(req.user, group)) {
      return res.status(404).json({ ok: false, message: "Grupo no encontrado." });
    }
  }

  const location = updateLiveLocation(req.user.id, validation.data);
  return res.json({
    ok: true,
    message: "Ubicacion compartida.",
    location
  });
};

export const getGroupLocations = (req, res) => {
  const group = getGroupById(req.params.groupId);
  if (!group || !canAccessGroup(req.user, group)) {
    return res.status(404).json({ ok: false, message: "Grupo no encontrado." });
  }

  return res.json({
    ok: true,
    message: "Ultimas ubicaciones del grupo obtenidas correctamente.",
    pollingInterval: 5000,
    groupId: group.id,
    locations: getLocationsByGroupId(group.id)
  });
};

export const getUserLocation = (req, res) => {
  const userId = Number(req.params.userId);
  const canView =
    req.user.role === "admin" ||
    req.user.id === userId ||
    getVisibleGroups(req.user).some((group) =>
      group.members.some((member) => member.userId === userId)
    );

  if (!canView) {
    return res.status(403).json({
      ok: false,
      message: "No tienes acceso a la ubicacion de esta persona."
    });
  }

  return getLocation(req, res);
};
