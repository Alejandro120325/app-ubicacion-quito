import { HttpError } from "../utils/httpError.js";

const GEOAPIFY_URL = "https://api.geoapify.com";
const REQUEST_TIMEOUT_MS = 8000;

const isConfiguredApiKey = (value = "") => {
  const key = value.trim().toLowerCase();
  return Boolean(key && !key.startsWith("tu_") && !key.startsWith("your_"));
};

const getApiKey = () => {
  const apiKey = process.env.GEOAPIFY_API_KEY?.trim();

  if (!isConfiguredApiKey(apiKey)) {
    throw new HttpError(
      503,
      "Geoapify no esta configurada. La aplicacion continua usando datos simulados.",
      "GEOAPIFY_NOT_CONFIGURED"
    );
  }

  return apiKey;
};

const requestGeoapify = async (path, params) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const searchParams = new URLSearchParams({
    ...params,
    apiKey: getApiKey()
  });

  try {
    const response = await fetch(`${GEOAPIFY_URL}${path}?${searchParams}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new HttpError(
        response.status >= 500 ? 502 : response.status,
        payload?.message || "Geoapify rechazo la solicitud.",
        "GEOAPIFY_REQUEST_FAILED"
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof HttpError) throw error;

    if (error.name === "AbortError") {
      throw new HttpError(504, "Geoapify excedio el tiempo de espera.", "GEOAPIFY_TIMEOUT");
    }

    throw new HttpError(
      502,
      "No fue posible conectar con Geoapify.",
      "GEOAPIFY_UNAVAILABLE"
    );
  } finally {
    clearTimeout(timeout);
  }
};

export const getGeoapifyStatus = () => {
  const configured = isConfiguredApiKey(process.env.GEOAPIFY_API_KEY);

  return {
    configured,
    provider: "Geoapify Location Platform",
    mode: configured ? "ready" : "simulated"
  };
};

export const geocodeAddress = (text) =>
  requestGeoapify("/v1/geocode/search", {
    text,
    lang: "es",
    filter: "countrycode:ec",
    bias: "proximity:-78.4678,-0.1807",
    limit: "5",
    format: "json"
  });

export const reverseGeocode = (lat, lon) =>
  requestGeoapify("/v1/geocode/reverse", {
    lat: String(lat),
    lon: String(lon),
    lang: "es",
    format: "json"
  });

export const calculateRoute = (from, to, mode = "drive") =>
  requestGeoapify("/v1/routing", {
    waypoints: `${from}|${to}`,
    mode,
    details: "instruction_details",
    format: "json"
  });

export const findNearbyPlaces = (lat, lon, category) =>
  requestGeoapify("/v2/places", {
    categories: category,
    filter: `circle:${lon},${lat},5000`,
    bias: `proximity:${lon},${lat}`,
    limit: "20"
  });

export const calculateIsoline = (lat, lon, type, mode, range) =>
  requestGeoapify("/v1/isoline", {
    lat: String(lat),
    lon: String(lon),
    type,
    mode,
    range: String(range)
  });
