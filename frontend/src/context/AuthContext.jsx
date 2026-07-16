import React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import api, { SESSION_KEY } from "../api/api.js";

const AuthContext = createContext(null);

const getStoredSession = () => {
  const value = localStorage.getItem(SESSION_KEY);

  if (value) {
    try {
      return JSON.parse(value);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (token && storedUser) {
    try {
      return { token, user: JSON.parse(storedUser) };
    } catch {
      localStorage.removeItem("user");
    }
  }

  return { token: null, user: null };
};

const normalizeLoginResponse = (payload) => {
  const body = payload?.data || payload || {};
  const token =
    body.token ||
    body.accessToken ||
    body.authToken ||
    body.data?.token ||
    body.data?.accessToken ||
    body.data?.authToken;
  const user = body.user || body.data?.user || body.profile || body.data?.profile;

  if (!token || !user) {
    throw new Error("El backend no devolvio token y usuario.");
  }

  return { token, user };
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredSession);

  const saveSession = (nextSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    localStorage.setItem("token", nextSession.token);
    localStorage.setItem("user", JSON.stringify(nextSession.user));
    setSession(nextSession);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    const nextSession = normalizeLoginResponse(data);
    saveSession(nextSession);
    return nextSession.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  };

  const logout = async () => {
    if (session.user) {
      await api.post("/activity", {
        type: "logout",
        priority: "info",
        message: `${session.user.fullName || session.user.email} cerro sesion.`,
        userId: session.user.id,
        userName: session.user.fullName || session.user.email
      }).catch(() => {});
    }

    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("geokipu_locked");
    setSession({ token: null, user: null });
  };

  const updateUser = (user) => {
    saveSession({ token: session.token, user });
  };

  const value = useMemo(
    () => ({
      token: session.token,
      user: session.user,
      isAuthenticated: Boolean(session.token && session.user),
      login,
      register,
      logout,
      updateUser
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};
