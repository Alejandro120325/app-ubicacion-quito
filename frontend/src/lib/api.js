import axios from "axios";

export const SESSION_KEY = "quito-location-session";
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
  /\/+$/,
  ""
);

export const getApiErrorMessage = (error) => {
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;

  if (serverMessage) return serverMessage;

  const messages = {
    400: "Solicitud invalida. Revisa los datos enviados.",
    401: "Sesion no autorizada. Inicia sesion nuevamente.",
    403: "No tienes permisos para esta accion.",
    404: "Recurso no encontrado.",
    500: "Error interno del backend local."
  };

  return messages[status] || "No se pudo conectar con el backend local.";
};

const readStoredToken = () => {
  const directToken = localStorage.getItem("token");
  if (directToken) return directToken;

  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session?.token || null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = readStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.normalizedMessage = getApiErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;
