import { databaseService } from "../services/database.service.js";
import { groupsService } from "../services/groups.service.js";
import { locationSharingService } from "../services/locationSharing.service.js";
import { locationsService } from "../services/locations.service.js";
import { usersService } from "../services/users.service.js";
import {
  sanitizeUser,
  validateLocationPayload,
  validateLocationUpdatePayload,
  validateStoredLocationPayload
} from "../utils/validators.js";

const canAccessGroup = (user, group) =>
  user.role === "admin" ||
  group.createdBy === user.id ||
  group.members.some(
    (member) => member.userId === user.id || member.email === user.email
  );

const canViewUser = async (requester, userId) => {
  if (requester.role === "admin" || requester.id === Number(userId)) return true;
  const visibleGroups = await groupsService.list(requester);
  return visibleGroups.some((group) =>
    group.members.some((member) => member.userId === Number(userId))
  );
};

export const getLocation = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const [user, location] = await Promise.all([
      usersService.getById(userId),
      locationsService.getByUser(userId)
    ]);
    if (!user || !location) {
      return res.status(404).json({
        ok: false,
        message: "No existe una ubicacion para este usuario."
      });
    }
    return res.json({
      ok: true,
      message: "Ubicacion obtenida correctamente",
      location: {
        ...location,
        sharing: user.sharingLocation,
        simulated: location.simulated ?? databaseService.mode === "memory"
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const shareLocation = async (req, res, next) => {
  const { sharing } = req.body;
  if (req.user.role !== "persona") {
    return res.status(403).json({
      ok: false,
      message: "Solo las cuentas tipo persona pueden cambiar este estado."
    });
  }
  if (typeof sharing !== "boolean") {
    return res.status(400).json({ ok: false, message: "El campo sharing debe ser true o false." });
  }

  try {
    const updatedUser = await locationSharingService.setSharing(req.user.id, sharing);
    return res.json({
      ok: true,
      message: sharing ? "Ubicacion compartida" : "Ubicacion pausada",
      sharing,
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    return next(error);
  }
};

export const startLocationSharing = (req, res, next) => {
  req.body = { ...(req.body || {}), sharing: true };
  return shareLocation(req, res, next);
};

export const stopLocationSharing = (req, res, next) => {
  req.body = { ...(req.body || {}), sharing: false };
  return shareLocation(req, res, next);
};

export const updateLocation = async (req, res, next) => {
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
  const requestedUserId = req.body.userId == null ? req.user.id : Number(req.body.userId);
  if (requestedUserId !== req.user.id) {
    return res.status(403).json({
      ok: false,
      message: "No puedes enviar coordenadas de otra cuenta."
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

  try {
    if (validation.data.groupId) {
      const group = await groupsService.getById(validation.data.groupId);
      if (!group || !canAccessGroup(req.user, group)) {
        return res.status(404).json({ ok: false, message: "Grupo no encontrado." });
      }
    }
    const { geoapify, location } = await locationSharingService.updateCoordinates({
      ...validation.data,
      userId: req.user.id,
      sharing: true
    });
    return res.json({
      ok: true,
      message: "Ubicacion compartida",
      location,
      geoapify: {
        enabled: Boolean(geoapify?.enabled),
        resolved: Boolean(geoapify?.resolved)
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const listLocations = async (req, res, next) => {
  try {
    const locations = await locationsService.list(req.user);
    return res.json({
      ok: true,
      message: "Ubicaciones obtenidas correctamente",
      storage: databaseService.mode,
      count: locations.length,
      locations
    });
  } catch (error) {
    return next(error);
  }
};

export const postLocation = async (req, res, next) => {
  const validation = validateStoredLocationPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa los datos de ubicacion.",
      errors: validation.errors
    });
  }

  if (req.user.role !== "admin" && req.user.id !== validation.data.userId) {
    return res.status(403).json({ ok: false, message: "No puedes actualizar otro usuario." });
  }

  try {
    const [user, group] = await Promise.all([
      usersService.getById(validation.data.userId),
      groupsService.getById(validation.data.groupId)
    ]);
    if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado." });
    if (!group || !canAccessGroup(req.user, group)) {
      return res.status(404).json({ ok: false, message: "Grupo no encontrado." });
    }
    const location = await locationsService.save(validation.data);
    return res.status(201).json({
      ok: true,
      message: "Ubicacion guardada correctamente",
      location
    });
  } catch (error) {
    return next(error);
  }
};

export const getGroupLocations = async (req, res, next) => {
  try {
    const group = await groupsService.getById(req.params.groupId);
    if (!group || !canAccessGroup(req.user, group)) {
      return res.status(404).json({ ok: false, message: "Grupo no encontrado." });
    }
    const locations = await locationsService.getByGroup(group.id);
    return res.json({
      ok: true,
      message: "Ubicaciones del grupo obtenidas correctamente",
      pollingInterval: 5000,
      groupId: group.id,
      locations
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserLocation = async (req, res, next) => {
  try {
    const allowed = await canViewUser(req.user, req.params.userId);
    if (!allowed) {
      return res.status(403).json({
        ok: false,
        message: "No tienes acceso a la ubicacion de esta persona."
      });
    }
    return getLocation(req, res, next);
  } catch (error) {
    return next(error);
  }
};

export const patchUserLocationStatus = async (req, res, next) => {
  const userId = Number(req.params.userId);
  if (typeof req.body.sharing !== "boolean") {
    return res.status(400).json({ ok: false, message: "El campo sharing debe ser booleano." });
  }
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ ok: false, message: "No puedes modificar otro usuario." });
  }

  try {
    const user = await locationSharingService.setSharing(userId, req.body.sharing);
    if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado." });
    return res.json({
      ok: true,
      message: req.body.sharing ? "Ubicacion compartida" : "Ubicacion pausada",
      sharing: req.body.sharing,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const getStoredLocation = async (req, res, next) => {
  try {
    const location = await locationsService.getById(req.params.id);
    if (!location) return res.status(404).json({ ok: false, message: "Ubicacion no encontrada." });
    if (!(await canViewUser(req.user, location.userId))) {
      return res.status(403).json({ ok: false, message: "No tienes acceso a esta ubicacion." });
    }
    return res.json({ ok: true, message: "Ubicacion obtenida correctamente", location });
  } catch (error) {
    return next(error);
  }
};

export const patchStoredLocation = async (req, res, next) => {
  const validation = validateLocationUpdatePayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa los datos de ubicacion.",
      errors: validation.errors
    });
  }

  try {
    const current = await locationsService.getById(req.params.id);
    if (!current) return res.status(404).json({ ok: false, message: "Ubicacion no encontrada." });
    if (req.user.role !== "admin" && req.user.id !== current.userId) {
      return res.status(403).json({ ok: false, message: "No puedes modificar esta ubicacion." });
    }
    const location = await locationsService.update(req.params.id, validation.data);
    if (validation.data.sharing !== undefined) {
      await locationSharingService.setSharing(current.userId, validation.data.sharing);
    }
    return res.json({ ok: true, message: "Ubicacion actualizada correctamente", location });
  } catch (error) {
    return next(error);
  }
};

export const deleteStoredLocation = async (req, res, next) => {
  try {
    const current = await locationsService.getById(req.params.id);
    if (!current) return res.status(404).json({ ok: false, message: "Ubicacion no encontrada." });
    if (req.user.role !== "admin" && req.user.id !== current.userId) {
      return res.status(403).json({ ok: false, message: "No puedes eliminar esta ubicacion." });
    }
    const location = await locationsService.remove(req.params.id);
    return res.json({ ok: true, message: "Ubicacion eliminada correctamente", location });
  } catch (error) {
    return next(error);
  }
};
