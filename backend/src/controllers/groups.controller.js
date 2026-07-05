import {
  addMemberToGroup,
  createGroup,
  getGroupById,
  getVisibleGroups,
  removeMemberFromGroup,
  users,
  updateMemberLocationStatus
} from "../data/mockData.js";
import {
  validateGroupMemberPayload,
  validateGroupPayload,
  validateLocationStatusPayload
} from "../utils/validators.js";

const canAccessGroup = (user, group) =>
  user.role === "admin" ||
  group.createdBy === user.id ||
  group.members.some((member) => member.email === user.email);

export const getGroups = (req, res) => {
  return res.json({
    ok: true,
    message: "Grupos simulados obtenidos correctamente",
    groups: getVisibleGroups(req.user)
  });
};

export const postGroup = (req, res) => {
  const validation = validateGroupPayload(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa los datos del grupo.",
      errors: validation.errors
    });
  }

  const group = createGroup({
    ...validation.data,
    createdBy: req.user.id
  });

  return res.status(201).json({
    ok: true,
    message: "Grupo simulado creado correctamente",
    group
  });
};

export const getGroup = (req, res) => {
  const group = getGroupById(req.params.groupId);

  if (!group || !canAccessGroup(req.user, group)) {
    return res.status(404).json({
      ok: false,
      message: "Grupo simulado no encontrado."
    });
  }

  return res.json({
    ok: true,
    message: "Grupo simulado obtenido correctamente",
    group
  });
};

export const postGroupMember = (req, res) => {
  const group = getGroupById(req.params.groupId);

  if (!group) {
    return res.status(404).json({
      ok: false,
      message: "Grupo simulado no encontrado."
    });
  }

  if (req.user.role !== "admin" && group.createdBy !== req.user.id) {
    return res.status(403).json({
      ok: false,
      message: "Solo la persona creadora o un administrador puede agregar integrantes."
    });
  }

  const registeredUser = users.find(
    (user) => user.email.toLowerCase() === req.body.email?.trim().toLowerCase()
  );
  const payload = registeredUser
    ? {
        ...req.body,
        fullName: registeredUser.fullName,
        email: registeredUser.email,
        phone: registeredUser.phone,
        cedula: registeredUser.cedula,
        locationStatus: registeredUser.sharingLocation ? "sharing" : "paused"
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
    return res.status(409).json({
      ok: false,
      message: "Esta persona ya pertenece al grupo."
    });
  }

  const member = addMemberToGroup(group.id, {
    ...validation.data,
    userId: registeredUser?.id || null
  });

  return res.status(201).json({
    ok: true,
    message: "Integrante agregado correctamente",
    member,
    group
  });
};

export const deleteGroupMember = (req, res) => {
  const group = getGroupById(req.params.groupId);

  if (!group || (req.user.role !== "admin" && group.createdBy !== req.user.id)) {
    return res.status(404).json({
      ok: false,
      message: "Grupo no encontrado o sin permisos para editarlo."
    });
  }

  if (group.createdBy === Number(req.params.userId)) {
    return res.status(409).json({
      ok: false,
      message: "La persona creadora no puede eliminarse del grupo."
    });
  }

  const removedMember = removeMemberFromGroup(group.id, req.params.userId);
  if (!removedMember) {
    return res.status(404).json({ ok: false, message: "Integrante no encontrado." });
  }

  return res.json({
    ok: true,
    message: "Integrante eliminado correctamente.",
    member: removedMember,
    group
  });
};

export const patchGroupMemberLocationStatus = (req, res) => {
  const group = getGroupById(req.params.groupId);

  if (!group || !canAccessGroup(req.user, group)) {
    return res.status(404).json({
      ok: false,
      message: "Grupo simulado no encontrado."
    });
  }

  const validation = validateLocationStatusPayload(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa el estado de ubicacion.",
      errors: validation.errors
    });
  }

  const member = updateMemberLocationStatus(
    group.id,
    req.params.memberId,
    validation.data.locationStatus
  );

  if (!member) {
    return res.status(404).json({
      ok: false,
      message: "Integrante no encontrado."
    });
  }

  return res.json({
    ok: true,
    message: "Estado de ubicacion actualizado",
    member,
    group
  });
};
