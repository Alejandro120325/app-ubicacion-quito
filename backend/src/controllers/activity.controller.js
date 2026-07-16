import { activityService } from "../services/activity.service.js";

export const listActivity = async (req, res, next) => {
  try {
    const events = await activityService.list(req.user);
    return res.json({ ok: true, count: events.length, events, alerts: events });
  } catch (error) {
    return next(error);
  }
};

export const listAlerts = async (req, res, next) => {
  try {
    const alerts = await activityService.listAlerts(req.user);
    return res.json({ ok: true, count: alerts.length, alerts, events: alerts });
  } catch (error) {
    return next(error);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    const event = await activityService.create(req.body, req.user);
    return res.status(201).json({
      ok: true,
      message: "Evento de bitacora creado correctamente",
      event,
      alert: event
    });
  } catch (error) {
    return next(error);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const alert = await activityService.createAlert(req.body, req.user);
    return res.status(201).json({
      ok: true,
      message: "Alerta creada correctamente",
      alert,
      event: alert
    });
  } catch (error) {
    return next(error);
  }
};

export const listActivityByUser = async (req, res, next) => {
  try {
    const events = await activityService.listByUser(req.params.userId, req.user);
    return res.json({ ok: true, count: events.length, events, alerts: events });
  } catch (error) {
    return next(error);
  }
};

export const listActivityByGroup = async (req, res, next) => {
  try {
    const events = await activityService.listByGroup(req.params.groupId, req.user);
    return res.json({ ok: true, count: events.length, events, alerts: events });
  } catch (error) {
    return next(error);
  }
};

export const markActivityRead = async (req, res, next) => {
  try {
    const event = await activityService.markRead(req.params.id, req.user);
    if (!event) return res.status(404).json({ ok: false, message: "Evento no encontrado." });
    return res.json({ ok: true, message: "Evento marcado como leido", event, alert: event });
  } catch (error) {
    return next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const event = await activityService.remove(req.params.id, req.user);
    if (!event) return res.status(404).json({ ok: false, message: "Evento no encontrado." });
    return res.json({ ok: true, message: "Evento eliminado correctamente", event, alert: event });
  } catch (error) {
    return next(error);
  }
};
