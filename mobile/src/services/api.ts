import { getStoredSession } from "@/services/storage";

const DEFAULT_API_URLS = {
  android: "http://10.0.2.2:4000/api",
  default: "http://localhost:4000/api",
  ios: "http://localhost:4000/api",
  web: "http://localhost:4000/api"
};

const getDefaultApiUrl = () => {
  const os = process.env.EXPO_OS as keyof typeof DEFAULT_API_URLS | undefined;
  return DEFAULT_API_URLS[os || "default"] || DEFAULT_API_URLS.default;
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getDefaultApiUrl();

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status = 0, errors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type ApiOptions = RequestInit & {
  body?: BodyInit | null;
};

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const session = await getStoredSession();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (session.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
    const data = await readJson(response);

    if (!response.ok) {
      throw new ApiError(data.message || "Solicitud fallida.", response.status, data.errors);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      `No se pudo conectar con el backend (${API_BASE_URL}). Verifica que este levantado o configura EXPO_PUBLIC_API_URL.`,
      0
    );
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      body: JSON.stringify(body),
      method: "POST"
    }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      body: JSON.stringify(body),
      method: "PATCH"
    })
};
