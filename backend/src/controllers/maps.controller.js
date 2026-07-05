import {
  calculateIsoline,
  calculateRoute,
  findNearbyPlaces,
  geocodeAddress,
  getGeoapifyStatus,
  reverseGeocode
} from "../services/geoapify.service.js";
import {
  parseCoordinates,
  parseNumberParam,
  requireQueryParam
} from "../utils/validators.js";

const sendProviderResponse = (res, data) =>
  res.json({ ok: true, provider: "geoapify", simulated: false, data });

export const getMapsStatus = (req, res) => {
  res.json({ ok: true, ...getGeoapifyStatus() });
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
