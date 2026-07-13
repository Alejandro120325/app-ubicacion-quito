import "dotenv/config";
import { HttpError } from "../utils/httpError.js";

const placeholderValues = new Set([
  "tu_supabase_url",
  "tu_service_role_key",
  "tu_anon_key",
  "tu_supabase_service_role_key",
  "tu_supabase_anon_key"
]);

const normalize = (value = "") => value.trim();
const isConfiguredValue = (value) => value && !placeholderValues.has(value);

export const supabaseConfig = {
  url: normalize(process.env.SUPABASE_URL).replace(/\/$/, ""),
  serviceRoleKey: normalize(process.env.SUPABASE_SERVICE_ROLE_KEY),
  anonKey: normalize(process.env.SUPABASE_ANON_KEY)
};

export const isSupabaseConfigured = Boolean(
  isConfiguredValue(supabaseConfig.url) &&
    isConfiguredValue(supabaseConfig.serviceRoleKey)
);

export const supabaseRequest = async (
  resource,
  { method = "GET", body, headers = {}, prefer } = {}
) => {
  if (!isSupabaseConfigured) {
    throw new HttpError(
      503,
      "Supabase no esta configurado.",
      "SUPABASE_NOT_CONFIGURED"
    );
  }

  const response = await fetch(`${supabaseConfig.url}/rest/v1/${resource}`, {
    method,
    headers: {
      apikey: supabaseConfig.serviceRoleKey,
      Authorization: `Bearer ${supabaseConfig.serviceRoleKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
      ...headers
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  }).catch(() => {
    throw new HttpError(
      502,
      "No fue posible conectar con Supabase.",
      "SUPABASE_UNAVAILABLE"
    );
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new HttpError(
      502,
      payload?.message || "Supabase rechazo la operacion.",
      "SUPABASE_REQUEST_FAILED",
      payload?.details || null
    );
  }

  return payload;
};

export const verifySupabaseConnection = async () => {
  if (!isSupabaseConfigured) return false;
  await supabaseRequest("profiles?select=id&limit=1");
  return true;
};
