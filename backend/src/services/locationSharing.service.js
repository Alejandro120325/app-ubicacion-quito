import { databaseService } from "./database.service.js";
import { ActivityEvent } from "../models/ActivityEvent.js";
import { activityService } from "./activity.service.js";
import { reverseGeocode } from "./geoapify.service.js";

const LOCATION_UPDATE_EVENT_THROTTLE_MS = 60_000;
const LOCATION_RESOLVED_EVENT_THROTTLE_MS = 5 * 60_000;

const latestEventIsRecent = async (userId, type, throttleMs) => {
  if (!throttleMs) return false;

  const latest = await ActivityEvent.findOne({ userId: Number(userId), type })
    .sort({ createdAt: -1 })
    .select({ createdAt: 1 })
    .lean();

  return latest?.createdAt
    ? Date.now() - new Date(latest.createdAt).getTime() < throttleMs
    : false;
};

const safeCreateActivity = async (payload, user, throttleMs = 0) => {
  if (!user) return null;

  try {
    if (await latestEventIsRecent(user.id, payload.type, throttleMs)) return null;
    return await activityService.create(payload, user);
  } catch (error) {
    console.warn(`No se pudo registrar evento ${payload.type}: ${error.message}`);
    return null;
  }
};

const enrichWithAddress = async (data) => {
  if (data.simulated !== false) {
    return {
      data,
      geoapify: {
        enabled: false,
        resolved: false
      }
    };
  }

  const resolved = await reverseGeocode(data.latitude, data.longitude);

  return {
    data: {
      ...data,
      address: data.address || resolved.address || "",
      city: resolved.city || data.city || "Quito",
      sector:
        data.sector && data.sector !== "Ubicacion GPS"
          ? data.sector
          : resolved.sector || "Ubicacion GPS"
    },
    geoapify: {
      enabled: Boolean(resolved.enabled),
      mode: resolved.mode,
      resolved: Boolean(resolved.resolved),
      provider: resolved.provider || "Geoapify"
    }
  };
};

export const locationSharingService = {
  async setSharing(userId, sharing) {
    const before = await databaseService.getUserById(userId);
    const user = await databaseService.setUserSharing(userId, sharing);

    if (user && Boolean(before?.sharingLocation) !== Boolean(sharing)) {
      await safeCreateActivity(
        {
          type: sharing ? "location_started" : "location_paused",
          priority: sharing ? "info" : "warning",
          message: sharing
            ? `${user.fullName} activo ubicacion real.`
            : `${user.fullName} pauso compartir ubicacion.`,
          userId: user.id,
          userName: user.fullName,
          sector: sharing ? "GPS activo" : "Ubicacion pausada"
        },
        user
      );
    }

    return user;
  },

  async updateCoordinates(data) {
    const user = await databaseService.getUserById(data.userId);
    const { data: enrichedData, geoapify } = await enrichWithAddress(data);
    const location = await databaseService.saveLocation(enrichedData);

    await safeCreateActivity(
      {
        type: "location_updated",
        priority: "info",
        message: `${user?.fullName || "Usuario GeoKipu"} actualizo su ubicacion.`,
        userId: data.userId,
        userName: user?.fullName,
        latitude: enrichedData.latitude,
        longitude: enrichedData.longitude,
        sector: location?.sector || enrichedData.sector || "GPS"
      },
      user,
      LOCATION_UPDATE_EVENT_THROTTLE_MS
    );

    if (geoapify.resolved) {
      await safeCreateActivity(
        {
          type: "location_resolved",
          priority: "info",
          message: `Ubicacion actualizada en ${location?.sector || location?.address || "GPS"}.`,
          userId: data.userId,
          userName: user?.fullName,
          latitude: enrichedData.latitude,
          longitude: enrichedData.longitude,
          sector: location?.sector || enrichedData.sector || "GPS"
        },
        user,
        LOCATION_RESOLVED_EVENT_THROTTLE_MS
      );
    }

    return { geoapify, location };
  }
};
