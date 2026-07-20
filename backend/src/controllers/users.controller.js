import { databaseService } from "../services/database.service.js";
import { activityService } from "../services/activity.service.js";
import { usersService } from "../services/users.service.js";
import {
  sanitizeUser,
  validateUserCreatePayload,
  validateUserUpdatePayload
} from "../utils/validators.js";

const canManageUser = (requester, userId) =>
  requester.role === "admin" || requester.id === Number(userId);

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await usersService.list();
    const visibleUsers = req.user.role === "admin"
      ? allUsers.filter((user) => user.role === "persona")
      : allUsers.filter((user) => user.id === req.user.id);
    const result = await Promise.all(
      visibleUsers.map(async (user) => ({
        ...sanitizeUser(user),
        lastLocation: (await usersService.getLastLocation(user.id)) || null
      }))
    );

    return res.json({
      ok: true,
      message: "Usuarios obtenidos correctamente",
      storage: databaseService.mode,
      count: result.length,
      users: result
    });
  } catch (error) {
    return next(error);
  }
};

export const postUser = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ ok: false, message: "Solo un administrador puede crear usuarios." });
  }

  try {
    const validation = validateUserCreatePayload(req.body, await usersService.list());
    if (!validation.isValid) {
      return res.status(400).json({
        ok: false,
        message: "Revisa los datos del usuario.",
        errors: validation.errors
      });
    }
    const user = await usersService.create({
      ...validation.data,
      active: false,
      sharingLocation: false,
      lastConnection: new Date().toISOString()
    });
    return res.status(201).json({
      ok: true,
      message: "Usuario creado correctamente",
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req, res, next) => {
  if (!canManageUser(req.user, req.params.id)) {
    return res.status(403).json({ ok: false, message: "No tienes acceso a este usuario." });
  }
  try {
    const user = await usersService.getById(req.params.id);
    if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado." });
    return res.json({ ok: true, message: "Usuario obtenido correctamente", user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const patchUser = async (req, res, next) => {
  if (!canManageUser(req.user, req.params.id)) {
    return res.status(403).json({ ok: false, message: "No puedes modificar este usuario." });
  }
  if (req.user.role !== "admin" && (req.body.role !== undefined || req.body.rol !== undefined)) {
    return res.status(403).json({ ok: false, message: "Solo un administrador puede cambiar roles." });
  }

  try {
    const current = await usersService.getById(req.params.id);
    if (!current) return res.status(404).json({ ok: false, message: "Usuario no encontrado." });
    const validation = validateUserUpdatePayload(
      req.body,
      await usersService.list(),
      req.params.id
    );
    if (!validation.isValid) {
      return res.status(400).json({
        ok: false,
        message: "Revisa los datos del usuario.",
        errors: validation.errors
      });
    }
    const user = await usersService.update(req.params.id, validation.data);
    await activityService.create(
      {
        userId: user.id,
        userName: user.fullName,
        type: "profile_updated",
        priority: "info",
        message: `${user.fullName} actualizo su perfil.`
      },
      req.user
    );
    return res.json({ ok: true, message: "Usuario actualizado correctamente", user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      ok: false,
      message: "No tienes permisos para eliminar esta persona"
    });
  }
  const targetId = Number(req.params.id);
  if (!Number.isInteger(targetId)) {
    return res.status(400).json({ ok: false, message: "Identificador de usuario invalido." });
  }
  if (req.user.id === targetId) {
    return res.status(409).json({ ok: false, message: "No puedes eliminar tu propia cuenta administrativa." });
  }

  try {
    const current = await usersService.getById(targetId);
    if (!current) return res.status(404).json({ ok: false, message: "Usuario no encontrado." });

    if (current.role === "admin") {
      const admins = (await usersService.list()).filter((user) => user.role === "admin");
      if (admins.length <= 1) {
        return res.status(409).json({
          ok: false,
          message: "No puedes eliminar el ultimo administrador del sistema."
        });
      }
    }

    const user = await usersService.remove(targetId);
    await activityService.create(
      {
        userId: user.id,
        userName: user.fullName,
        type: "user_deleted",
        priority: "info",
        message: `${req.user.fullName} elimino a ${user.fullName}.`
      },
      req.user
    );

    return res.json({
      ok: true,
      message: "Persona eliminada correctamente",
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = (req, res) => {
  return res.json({
    ok: true,
    message: "Usuario autenticado obtenido correctamente",
    user: sanitizeUser(req.user)
  });
};
