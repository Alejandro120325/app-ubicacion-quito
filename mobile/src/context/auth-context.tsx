import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/services/api";
import { clearStoredSession, getStoredSession, saveStoredSession } from "@/services/storage";
import type { RegisterPayload, Session, User } from "@/types";

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  session: Session;
  updateUser: (user: User) => Promise<void>;
  user: User | null;
};

type LoginResponse = {
  ok: boolean;
  token: string;
  user: User;
};

type RegisterResponse = {
  ok: boolean;
  user: User;
};

const emptySession: Session = { token: null, user: null };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(emptySession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getStoredSession().then((storedSession) => {
      if (!mounted) return;
      setSession(storedSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const persistSession = useCallback(async (nextSession: Session) => {
    await saveStoredSession(nextSession);
    setSession(nextSession);
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const data = await api.post<LoginResponse>("/auth/login", credentials);
    await persistSession({ token: data.token, user: data.user });
    return data.user;
  }, [persistSession]);

  const register = useCallback(async (payload: RegisterPayload) => {
    await api.post<RegisterResponse>("/auth/register", payload);
  }, []);

  const logout = useCallback(async () => {
    await clearStoredSession();
    setSession(emptySession);
  }, []);

  const updateUser = useCallback(async (user: User) => {
    await persistSession({ token: session.token, user });
  }, [persistSession, session.token]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session.token && session.user),
      loading,
      login,
      logout,
      register,
      session,
      updateUser,
      user: session.user
    }),
    [loading, login, logout, register, session, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.use(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
