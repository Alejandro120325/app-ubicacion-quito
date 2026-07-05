import api from "./api.js";

const unwrap = (response) => response.data;

export const mapsApi = {
  getStatus: () => api.get("/maps/status").then(unwrap),
  geocode: (text) => api.get("/maps/geocode", { params: { text } }).then(unwrap),
  reverse: (latitude, longitude) =>
    api
      .get("/maps/reverse", { params: { lat: latitude, lon: longitude } })
      .then(unwrap),
  routing: (from, to, mode = "drive") =>
    api.get("/maps/routing", { params: { from, to, mode } }).then(unwrap),
  places: (latitude, longitude, category) =>
    api
      .get("/maps/places", {
        params: { lat: latitude, lon: longitude, category }
      })
      .then(unwrap),
  isoline: (latitude, longitude, type = "time", mode = "walk", range = 600) =>
    api
      .get("/maps/isoline", {
        params: { lat: latitude, lon: longitude, type, mode, range }
      })
      .then(unwrap)
};

export const getReverseAddress = (payload) => {
  const result = payload?.data?.results?.[0] || payload?.data?.features?.[0]?.properties;
  return result?.formatted || result?.address_line2 || result?.address_line1 || "";
};
