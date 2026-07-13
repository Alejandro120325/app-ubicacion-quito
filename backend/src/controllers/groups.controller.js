import { groupMembersService } from "../services/groupMembers.service.js";
import { groupsService } from "../services/groups.service.js";
import { usersService } from "../services/users.service.js";
import { databaseService } from "../services/database.service.js";
import {
  validateGroupMemberPayload,
  validateGroupMemberUpdatePayload,
  validateGroupPayload,
  validateGroupUpdatePayload,
  validateLocationStatusPayload
} from "../utils/validators.js";

const canAccessGroup = (user, group) =>
  user.role === "admin" ||
  group.createdBy === user.id ||
  group.members.some(
    (member) => member.userId === user.id || member.email === user.email
  );

const canManageGroup = (user, group) =>
  user.role === "admin" || group.createdBy === user.id;

const loadAccessibleGroup = async (req, res, manage = false) => {
  const group = await groupsService.getById(req.params.groupId);
  const allowed = group && (manage ? canManageGroup(req.user, group) : canAccessGroup(req.user, group));

  if (!allowed) {
    res.status(group ? 403 : 404).json({
      ok: false,
      message: group
        ? "No tienes permisos para modificar este grupo."
        : "Grupo no encontrado."
    });
    return null;
  }

  return group;
};

export const getGroups = async (req, res, next) => {
  try {
    const groups = await groupsService.list(req.user);
    return res.json({
      ok: true,
      message: "Grupos obtenidos correctamente",
      storage: databaseService.mode,
      groups
    });
  } catch (error) {
    return next(error);
  }
};

export const postGroup = async (req, res, next) => {
  const validation = validateGroupPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa los datos del grupo.",
      errors: validation.errors
    });
  }

  try {
    const group = await groupsService.create({
      ...validation.data,
      createdBy: req.user.id
    });
    return res.status(201).json({
      ok: true,
      message: "Grupo creado correctamente",
      group
    });
  } catch (error) {
    return next(error);
  }
};

export const getGroup = async (req, res, next) => {
  try {
    const group = await loadAccessibleGroup(req, res);
    if (!group) return undefined;
    return res.json({ ok: true, message: "Grupo obtenido correctamente", group });
  } catch (error) {
    return next(error);
  }
};

export const patchGroup = async (req, res, next) => {
  const validation = validateGroupUpdatePayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa los datos del grupo.",
      errors: validation.errors
    });
  }

  try {
    const group = await loadAccessibleGroup(req, res, true);
    if (!group) return undefined;
    const updated = await groupsService.update(group.id, validation.data);
    return res.json({ ok: true, message: "Grupo actualizado correctamente", group: updated });
  } catch (error) {
    return next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const group = await loadAccessibleGroup(req, res, true);
    if (!group) return undefined;
    const deleted = await groupsService.remove(group.id);
    return res.json({ ok: true, message: "Grupo eliminado correctamente", group: deleted });
  } catch (error) {
    return next(error);
  }
};

export const getGroupMembers = async (req, res, next) => {
  try {
    const group = await loadAccessibleGroup(req, res);
    if (!group) return undefined;
    return res.json({
      ok: true,
      message: "Integrantes obtenidos correctamente",
      groupId: group.id,
      members: group.members
    });
  } catch (error) {
    return next(error);
  }
};

export const postGroupMember = async (req, res, next) => {
  try {
    const group = await loadAccessibleGroup(req, res, true);
    if (!group) return undefined;

    const email = req.body.email?.trim().toLowerCase() || "";
    const registeredUser = email
      ? await usersService.getByEmail(email)
      : null;
    const payload = registeredUser
      ? {
          ...req.body,
          fullName: registeredUser.fullName,
          email: registeredUser.email,
          phone: registeredUser.phone,
          cedula: registeredUser.cedula,
          locationStatus: req.body.locationStatus ||
            (registeredUser.sharingLocation ? "sharing" : "paused")
        }
      : req.body;
    const validation = validateGroupMemberPayload(payload);

    if (!validation.isValid) {
      return res.status(400).json({
        ok: false,
        message: "Revisa los datos del integrante.",
        errors: validation.errors
      });
    }

    if (
      group.members.some(
        (member) => member.email.toLowerCase() === validation.data.email.toLowerCase()
      )
    ) {
      return res.status(409).json({ ok: false, message: "Esta persona ya pertenece al grupo." });
    }

    const member = await groupMembersService.create(group.id, {
      ...validation.data,
      userId: registeredUser?.id || null
    });
    const updatedGroup = await groupsService.getById(group.id);
    return res.status(201).json({
      ok: true,
      message: "Integrante agregado correctamente",
      member,
      group: updatedGroup
    });
  } catch (error) {
    return next(error);
  }
};

export const patchGroupMember = async (req, res, next) => {
  const validation = validateGroupMemberUpdatePayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa los datos del integrante.",
      errors: validation.errors
    });
  }

  try {
    const group = await loadAccessibleGroup(req, res, true);
    if (!group) return undefined;
    const member = await groupMembersService.update(
      group.id,
      req.params.memberId,
      validation.data
    );
    if (!member) {
      return res.status(404).json({ ok: false, message: "Integrante no encontrado." });
    }
    const updatedGroup = await groupsService.getById(group.id);
    return res.json({
      ok: true,
      message: "Integrante actualizado correctamente",
      member,
      group: updatedGroup
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteGroupMember = async (req, res, next) => {
  try {
    const group = await loadAccessibleGroup(req, res, true);
    if (!group) return undefined;
    const target = group.members.find((member) => member.id === Number(req.params.memberId));
    if (!target) {
      return res.status(404).json({ ok: false, message: "Integrante no encontrado." });
    }
    if (target.userId === group.createdBy) {
      return res.status(409).json({
        ok: false,
        message: "La persona creadora no puede eliminarse del grupo."
      });
    }
    const member = await groupMembersService.remove(group.id, target.id);
    const updatedGroup = await groupsService.getById(group.id);
    return res.json({
      ok: true,
      message: "Integrante eliminado correctamente",
      member,
      group: updatedGroup
    });
  } catch (error) {
    return next(error);
  }
};

export const patchGroupMemberLocationStatus = async (req, res, next) => {
  const validation = validateLocationStatusPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa el estado de ubicacion.",
      errors: validation.errors
    });
  }
  req.body = validation.data;
  return patchGroupMember(req, res, next);
};
