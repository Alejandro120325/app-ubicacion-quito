import {
  addMemberToGroup,
  createGroup,
  getGroupById,
  getVisibleGroups,
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

  if (!group || !canAccessGroup(req.user, group)) {
    return res.status(404).json({
      ok: false,
      message: "Grupo simulado no encontrado."
    });
  }

  const validation = validateGroupMemberPayload(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Revisa los datos del integrante.",
      errors: validation.errors
    });
  }

  const member = addMemberToGroup(group.id, validation.data);

  return res.status(201).json({
    ok: true,
    message: "Integrante agregado correctamente",
    member,
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
