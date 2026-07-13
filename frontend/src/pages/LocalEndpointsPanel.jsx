import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Database,
  Layers3,
  MapPinned,
  RefreshCw,
  ServerCog,
  UsersRound,
  XCircle
} from "lucide-react";
import api, { API_URL, getApiErrorMessage } from "../api/api.js";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const endpointRequest = async (label, request) => {
  try {
    const { data } = await request();
    return { label, ok: true, data };
  } catch (error) {
    return {
      label,
      ok: false,
      message: getApiErrorMessage(error)
    };
  }
};

const getCount = (endpoint, key) => {
  const value = endpoint?.data?.[key];
  return Array.isArray(value) ? value.length : endpoint?.data?.count ?? 0;
};

const EndpointStatus = ({ endpoint }) => {
  const Icon = endpoint.ok ? CheckCircle2 : XCircle;

  return (
    <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[var(--color-text)]">{endpoint.label}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {endpoint.ok ? "Disponible en local" : endpoint.message}
          </p>
        </div>
        <Icon
          className={`h-5 w-5 ${endpoint.ok ? "text-emerald-500" : "text-red-500"}`}
          aria-hidden="true"
        />
      </div>
    </article>
  );
};

const DataCard = ({ icon: Icon, label, value, detail }) => (
  <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm text-[var(--color-muted)]">{label}</p>
        <p className="mt-2 text-3xl font-bold text-[var(--color-text)]">{value}</p>
      </div>
      <span className="rounded-lg bg-[var(--color-soft)] p-3 text-[var(--color-primary)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
    <p className="mt-3 text-sm text-[var(--color-muted)]">{detail}</p>
  </article>
);

const LocalEndpointsPanel = () => {
  const { user } = useAuth();
  const [endpoints, setEndpoints] = useState({});
  const [loading, setLoading] = useState(true);

  const loadEndpoints = async () => {
    setLoading(true);

    const baseResults = {};
    const requests = [
      ["health", "GET /api/health", () => api.get("/health")],
      ["me", "GET /api/auth/me", () => api.get("/auth/me")],
      ["users", "GET /api/users", () => api.get("/users")],
      ["groups", "GET /api/groups", () => api.get("/groups")],
      ["locations", "GET /api/locations", () => api.get("/locations")],
      ["maps", "GET /api/maps/status", () => api.get("/maps/status")]
    ];

    for (const [key, label, request] of requests) {
      baseResults[key] = await endpointRequest(label, request);
    }

    const firstGroupId = baseResults.groups?.data?.groups?.[0]?.id;
    baseResults.members = firstGroupId
      ? await endpointRequest("GET /api/groups/:groupId/members", () =>
          api.get(`/groups/${firstGroupId}/members`)
        )
      : { label: "GET /api/groups/:groupId/members", ok: true, data: { members: [] } };
    baseResults.groupLocations = firstGroupId
      ? await endpointRequest("GET /api/location/group/:groupId", () =>
          api.get(`/location/group/${firstGroupId}`)
        )
      : { label: "GET /api/location/group/:groupId", ok: true, data: { locations: [] } };

    setEndpoints(baseResults);
    setLoading(false);
  };

  useEffect(() => {
    loadEndpoints();
  }, []);

  const stats = useMemo(
    () => [
      {
        icon: UsersRound,
        label: "Usuarios registrados",
        value: getCount(endpoints.users, "users"),
        detail: "Respuesta desde GET /api/users"
      },
      {
        icon: Layers3,
        label: "Grupos",
        value: getCount(endpoints.groups, "groups"),
        detail: "Respuesta desde GET /api/groups"
      },
      {
        icon: Database,
        label: "Miembros",
        value: getCount(endpoints.members, "members"),
        detail: "Primer grupo disponible"
      },
      {
        icon: MapPinned,
        label: "Ubicaciones",
        value: getCount(endpoints.locations, "locations"),
        detail: "Respuesta desde GET /api/locations"
      }
    ],
    [endpoints]
  );

  const orderedEndpoints = [
    endpoints.health,
    endpoints.me,
    endpoints.users,
    endpoints.groups,
    endpoints.members,
    endpoints.locations,
    endpoints.groupLocations,
    endpoints.maps
  ].filter(Boolean);

  return (
    <motion.section
      className="mx-auto grid max-w-7xl gap-6"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            Revision local
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            Panel de Endpoints Locales
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">
            Comprobacion rapida del backend local, usuario autenticado y datos principales
            consumidos por el frontend web.
          </p>
        </div>
        <Button icon={RefreshCw} variant="secondary" onClick={loadEndpoints} disabled={loading}>
          {loading ? "Verificando..." : "Actualizar"}
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass-card-subtle p-5 md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-[var(--color-soft)] p-3 text-[var(--color-primary)]">
              <ServerCog className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-[var(--color-text)]">Backend local</p>
              <p className="text-sm text-[var(--color-muted)]">{API_URL}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <span className="status-chip text-sm font-semibold text-[var(--color-text)]">
              Storage: {endpoints.health?.data?.storage || "verificando"}
            </span>
            <span className="status-chip text-sm font-semibold text-[var(--color-text)]">
              MongoDB: {endpoints.health?.data?.mongodb || "verificando"}
            </span>
            <span className="status-chip text-sm font-semibold text-[var(--color-text)]">
              Maps: {endpoints.maps?.data?.mode || "verificando"}
            </span>
          </div>
        </article>

        <article className="glass-card-subtle p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-[var(--color-soft)] p-3 text-[var(--color-secondary)]">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-[var(--color-text)]">Usuario logueado</p>
              <p className="truncate text-sm text-[var(--color-muted)]">{user?.email}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Rol activo: <span className="font-semibold text-[var(--color-text)]">{user?.role}</span>
          </p>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <DataCard {...item} key={item.label} />
        ))}
      </section>

      <section className="glass-card p-5">
        <h2 className="text-xl font-bold text-[var(--color-text)]">Estado de endpoints</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {orderedEndpoints.map((endpoint) => (
            <EndpointStatus endpoint={endpoint} key={endpoint.label} />
          ))}
        </div>
      </section>
    </motion.section>
  );
};

export default LocalEndpointsPanel;
