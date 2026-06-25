import * as SecureStore from "expo-secure-store";

import type { Session } from "@/types";

const SESSION_KEY = "quito-location-session";
const isWeb = process.env.EXPO_OS === "web";

function webStorage() {
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

export async function getStoredSession(): Promise<Session> {
  try {
    const raw = isWeb
      ? webStorage()?.getItem(SESSION_KEY) || null
      : await SecureStore.getItemAsync(SESSION_KEY);

    if (!raw) return { token: null, user: null };
    return JSON.parse(raw) as Session;
  } catch {
    await clearStoredSession();
    return { token: null, user: null };
  }
}

export async function saveStoredSession(session: Session) {
  const value = JSON.stringify(session);

  if (isWeb) {
    webStorage()?.setItem(SESSION_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(SESSION_KEY, value);
}

export async function clearStoredSession() {
  if (isWeb) {
    webStorage()?.removeItem(SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_KEY);
}
