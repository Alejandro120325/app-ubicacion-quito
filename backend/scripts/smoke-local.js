const BASE_URL = process.env.LOCAL_API_URL || "http://localhost:4000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `${options.method || "GET"} ${path} fallo con ${response.status}: ${
        data?.message || response.statusText
      }`
    );
  }

  return data;
};

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`
});

const ecuadorCedula = (seed) => {
  const firstNine = `171${String(seed).padStart(6, "0").slice(-6)}`;
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const sum = firstNine
    .split("")
    .reduce((total, digit, index) => {
      let value = Number(digit) * coefficients[index];
      if (value >= 10) value -= 9;
      return total + value;
    }, 0);
  const verifier = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return `${firstNine}${verifier}`;
};

const run = async () => {
  const suffix = Date.now().toString().slice(-8);

  const health = await request("/health");
  if (health.storage !== "mongodb" || health.mongodb !== "connected") {
    throw new Error("Health no reporta MongoDB local conectado.");
  }
  console.log("OK Health");

  const login = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "admin@geokipu.com",
      password: "Admin123"
    })
  });
  const token = login.token || login.accessToken || login.data?.token;
  if (!token || !login.user) throw new Error("Login no devolvio token y user.");
  console.log("OK Login");

  await request("/auth/me", { headers: authHeaders(token) });

  await request("/users", { headers: authHeaders(token) });
  const createdUser = await request("/users", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      fullName: "Usuario Smoke Local",
      email: `smoke.${suffix}@geokipu.com`,
      password: "Smoke123",
      language: "es",
      cedula: ecuadorCedula(Number(suffix)),
      phone: `09${suffix}`,
      role: "persona"
    })
  });
  if (!createdUser.user?.id) throw new Error("No se pudo crear usuario smoke.");
  console.log("OK Users");

  const groups = await request("/groups", { headers: authHeaders(token) });
  const createdGroup = await request("/groups", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      name: `Grupo Smoke ${suffix}`,
      description: "Grupo creado por prueba smoke local"
    })
  });
  if (!Array.isArray(groups.groups) || !createdGroup.group?.id) {
    throw new Error("No se pudieron validar grupos.");
  }
  console.log("OK Groups");

  await request("/locations", { headers: authHeaders(token) });
  console.log("OK Locations");

  await request("/maps/status");
  await request("/maps/geocode?text=Quito", { headers: authHeaders(token) });
  await request("/maps/reverse?lat=-0.1807&lon=-78.4678", { headers: authHeaders(token) });
  await request("/maps/routing?from=-0.1807,-78.4678&to=-0.2,-78.5", {
    headers: authHeaders(token)
  });
  await request("/maps/places?lat=-0.1807&lon=-78.4678&category=commercial", {
    headers: authHeaders(token)
  });
  await request("/maps/isoline?lat=-0.1807&lon=-78.4678&type=time&mode=walk&range=600", {
    headers: authHeaders(token)
  });
  console.log("OK Maps");

  console.log("Pruebas locales finalizadas");
};

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
