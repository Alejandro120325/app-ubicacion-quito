export const PIN_HASH_KEY = "geokipu_pin_hash";
export const AUTO_LOCK_SECONDS_KEY = "geokipu_auto_lock_seconds";
export const LOCKED_KEY = "geokipu_locked";

const encoder = new TextEncoder();

export const hashPin = async (pin) => {
  const data = encoder.encode(`geokipu:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const hasPin = () => Boolean(localStorage.getItem(PIN_HASH_KEY));

export const savePin = async (pin) => {
  localStorage.setItem(PIN_HASH_KEY, await hashPin(pin));
};

export const verifyPin = async (pin) => {
  const stored = localStorage.getItem(PIN_HASH_KEY);
  if (!stored) return false;
  return stored === (await hashPin(pin));
};

export const getAutoLockSeconds = () =>
  Number(localStorage.getItem(AUTO_LOCK_SECONDS_KEY) || 120);

export const saveAutoLockSeconds = (seconds) => {
  localStorage.setItem(AUTO_LOCK_SECONDS_KEY, String(Number(seconds) || 120));
};
