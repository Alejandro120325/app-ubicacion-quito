import axios from "axios";

const SESSION_KEY = "quito-location-session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const storedSession = localStorage.getItem(SESSION_KEY);
  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
    return config;
  }

  if (storedSession) {
    try {
    const session = JSON.parse(storedSession);

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  return config;
});

export default api;
