import React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/api.js";

const SESSION_KEY = "quito-location-session";
const AuthContext = createContext(null);

const getStoredSession = () => {
  const value = localStorage.getItem(SESSION_KEY);

  if (!value) {
    return { token: null, user: null };
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredSession);

  const saveSession = (nextSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    localStorage.setItem("token", nextSession.token || "");
    localStorage.setItem("user", JSON.stringify(nextSession.user || null));
    setSession(nextSession);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    const nextSession = { token: data.token, user: data.user };
    saveSession(nextSession);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
