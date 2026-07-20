import { ActivityEvent } from "../models/ActivityEvent.js";

const clean = (document) => {
  if (!document) return null;
  const value = document?.toObject ? document.toObject() : { ...document };
  delete value._id;
  delete value.__v;
  return value;
};

const nextId = async () => {
  const latest = await ActivityEvent.findOne().sort({ id: -1 }).select({ id: 1 }).lean();
  return (latest?.id || 0) + 1;
};

const canReadEvent = (user, event) =>
  user.role === "admin" || Number(event.userId) === Number(user.id);

export const ALERT_TYPES = [
  "gps_disabled",
  "gps_denied",
  "gps_error",
  "disconnection",
  "emergency",
  "location_paused",
  "device_offline",
  "sos",
  "group_deleted",
  "member_removed"
];

const alertFilter = {
  $or: [{ priority: { $in: ["warning", "high"] } }, { type: { $in: ALERT_TYPES } }]
};

const normalizePayload = (payload, user) => ({
  userId: Number(payload.userId || user.id),
  userName: String(payload.userName || user.fullName || user.email || "Usuario GeoKipu"),
  userEmail: String(payload.userEmail || payload.email || user.email || ""),
  userPhone: String(payload.userPhone || payload.phone || user.phone || ""),
  groupId: payload.groupId == null || payload.groupId === "" ? null : Number(payload.groupId),
  groupName: String(payload.groupName || ""),
  type: String(payload.type || "info"),
  message: String(payload.message || "Evento registrado en GeoKipu."),
  priority: ["info", "warning", "high"].includes(payload.priority) ? payload.priority : "info",
  latitude: payload.latitude == null || payload.latitude === "" ? null : Number(payload.latitude),
  longitude: payload.longitude == null || payload.longitude === "" ? null : Number(payload.longitude),
  sector: String(payload.sector || ""),
  read: Boolean(payload.read)
});

export const activityService = {
  async list(user) {
    const filter = user.role === "admin" ? {} : { userId: Number(user.id) };
    return (await ActivityEvent.find(filter).sort({ createdAt: -1 }).limit(100).lean()).map(clean);
  },

  async listAlerts(user) {
    const filter =
      user.role === "admin"
        ? alertFilter
        : { $and: [{ userId: Number(user.id) }, alertFilter] };
    return (await ActivityEvent.find(filter).sort({ createdAt: -1 }).limit(100).lean()).map(clean);
  },

  async create(payload, user) {
    const data = normalizePayload(payload, user);
    const created = await ActivityEvent.create({ id: await nextId(), ...data });
    return clean(created);
  },

  async createAlert(payload, user) {
    return this.create(
      {
        ...payload,
        priority: payload.priority === "info" ? "high" : payload.priority || "high",
        type: payload.type || "disconnection"
      },
      user
    );
  },

  async listByUser(userId, user) {
    if (user.role !== "admin" && Number(userId) !== Number(user.id)) return [];
    return (await ActivityEvent.find({ userId: Number(userId) }).sort({ createdAt: -1 }).lean()).map(clean);
  },

  async listByGroup(groupId, user) {
    const rows = (await ActivityEvent.find({ groupId: Number(groupId) }).sort({ createdAt: -1 }).lean()).map(clean);
    return rows.filter((event) => canReadEvent(user, event));
  },

  async markRead(id, user) {
    const event = clean(await ActivityEvent.findOne({ id: Number(id) }).lean());
    if (!event || !canReadEvent(user, event)) return null;

    return clean(
      await ActivityEvent.findOneAndUpdate(
        { id: Number(id) },
        { $set: { read: true } },
        { new: true, runValidators: true }
      ).lean()
    );
  },

  async remove(id, user) {
    const event = clean(await ActivityEvent.findOne({ id: Number(id) }).lean());
    if (!event || !canReadEvent(user, event)) return null;

    return clean(await ActivityEvent.findOneAndDelete({ id: Number(id) }).lean());
  }
};
