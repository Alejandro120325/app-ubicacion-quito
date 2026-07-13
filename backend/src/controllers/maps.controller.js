import {
  calculateIsoline,
  calculateRoute,
  findNearbyPlaces,
  geocodeAddress,
  getGeoapifyStatus,
  reverseGeocode
} from "../services/maps.service.js";
import {
  parseCoordinates,
  parseNumberParam,
  requireQueryParam
} from "../utils/validators.js";

const sendProviderResponse = (res, payload) => {
  const simulated = Boolean(payload?.simulated);
  return res.json({
    ok: true,
    provider: simulated ? payload.provider : "geoapify",
    simulated,
    data: simulated ? payload.data : payload
  });
};

export const getMapsStatus = (req, res) => {
  res.json({ ok: true, ...getGeoapifyStatus() });
};

const validateMockPoint = (point, name) => {
  const latitude = Number(point?.latitude);
  const longitude = Number(point?.longitude);
  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return { error: `${name} debe incluir latitude y longitude validas.` };
  }
  return { latitude, longitude };
};

export const mockRoute = (req, res) => {
  const from = validateMockPoint(req.body.from, "from");
  const to = validateMockPoint(req.body.to, "to");
  if (from.error || to.error) {
    return res.status(400).json({
      ok: false,
      message: from.error || to.error
    });
  }

  const middle = {
    latitude: Number(((from.latitude + to.latitude) / 2).toFixed(6)),
    longitude: Number(((from.longitude + to.longitude) / 2).toFixed(6))
  };
  const distanceKm = Number(
    (Math.hypot(from.latitude - to.latitude, from.longitude - to.longitude) * 111).toFixed(2)
  );

  return res.status(201).json({
    ok: true,
    message: "Ruta simulada generada correctamente",
    provider: "simulated",
    simulated: true,
    route: {
      from,
      to,
      points: [from, middle, to],
      distanceKm,
      estimatedMinutes: Math.max(1, Math.round((distanceKm / 30) * 60))
    }
  });
};

export const geocode = async (req, res, next) => {
  try {
    const text = requireQueryParam(req.query.text, "text");
    return sendProviderResponse(res, await geocodeAddress(text));
  } catch (error) {
    return next(error);
  }
};

export const reverse = async (req, res, next) => {
  try {
    const lat = parseNumberParam(req.query.lat, "lat", -90, 90);
    const lon = parseNumberParam(req.query.lon, "lon", -180, 180);
    return sendProviderResponse(res, await reverseGeocode(lat, lon));
  } catch (error) {
    return next(error);
  }
};

export const routing = async (req, res, next) => {
  try {
    const from = parseCoordinates(req.query.from, "from");
    const to = parseCoordinates(req.query.to, "to");
    return sendProviderResponse(res, await calculateRoute(from, to, req.query.mode || "drive"));
  } catch (error) {
    return next(error);
  }
};

export const places = async (req, res, next) => {
  try {
    const lat = parseNumberParam(req.query.lat, "lat", -90, 90);
    const lon = parseNumberParam(req.query.lon, "lon", -180, 180);
    const category = requireQueryParam(req.query.category, "category");
    return sendProviderResponse(res, await findNearbyPlaces(lat, lon, category));
  } catch (error) {
    return next(error);
  }
};

export const isoline = async (req, res, next) => {
  try {
    const lat = parseNumberParam(req.query.lat, "lat", -90, 90);
    const lon = parseNumberParam(req.query.lon, "lon", -180, 180);
    const type = ["time", "distance"].includes(req.query.type) ? req.query.type : "time";
    const mode = requireQueryParam(req.query.mode || "walk", "mode");
    const range = parseNumberParam(req.query.range, "range", 1, 100000);
    return sendProviderResponse(res, await calculateIsoline(lat, lon, type, mode, range));
  } catch (error) {
    return next(error);
  }
};
