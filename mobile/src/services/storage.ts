import * as SecureStore from "expo-secure-store";

import type { Session } from "@/types";

const SESSION_KEY = "quito-location-session";
const ONBOARDING_KEY = "geokipu_onboarding_done";
const PIN_HASH_KEY = "geokipu_pin_hash";
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

const hashPin = (pin: string) => {
  let hash = 5381;
  const value = `geokipu:${pin}`;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return String(hash >>> 0);
};

export async function hasCompletedOnboarding() {
  const value = isWeb
    ? webStorage()?.getItem(ONBOARDING_KEY)
    : await SecureStore.getItemAsync(ONBOARDING_KEY);
  return value === "true";
}

export async function markOnboardingComplete() {
  if (isWeb) {
    webStorage()?.setItem(ONBOARDING_KEY, "true");
    return;
  }
  await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
}

export async function hasLocalPin() {
  const value = isWeb
    ? webStorage()?.getItem(PIN_HASH_KEY)
    : await SecureStore.getItemAsync(PIN_HASH_KEY);
  return Boolean(value);
}

export async function saveLocalPin(pin: string) {
  const value = hashPin(pin);
  if (isWeb) {
    webStorage()?.setItem(PIN_HASH_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(PIN_HASH_KEY, value);
}

export async function verifyLocalPin(pin: string) {
  const stored = isWeb
    ? webStorage()?.getItem(PIN_HASH_KEY)
    : await SecureStore.getItemAsync(PIN_HASH_KEY);
  return Boolean(stored && stored === hashPin(pin));
}

export async function clearLocalPin() {
  if (isWeb) {
    webStorage()?.removeItem(PIN_HASH_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(PIN_HASH_KEY);
}
