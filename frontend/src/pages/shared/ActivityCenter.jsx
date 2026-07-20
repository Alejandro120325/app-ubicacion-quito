import React, { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Plus,
  ScrollText,
  Trash2
} from "lucide-react";
import Button from "../../components/Button.jsx";
import InputField from "../../components/InputField.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import api, { getApiErrorMessage } from "../../api/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const ALERT_TYPES = [
  "gps_disabled",
  "gps_denied",
  "gps_error",
  "disconnection",
  "emergency",
  "location_paused",
  "device_offline",
  "sos"
];

const GROUP_ALERT_TYPES = ["group_deleted", "member_removed"];

const ACTIVITY_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "location", label: "Ubicacion" },
  { key: "security", label: "Seguridad" },
  { key: "profile", label: "Perfil" },
  { key: "groups", label: "Grupos" },
  { key: "system", label: "Sistema" }
];

const ALERT_FILTERS = [
  { key: "all", label: "Todas" },
  { key: "unread", label: "No leidas" },
  { key: "high", label: "Alta prioridad" },
  { key: "gps", label: "GPS/desconexion" }
];

const priorityClasses = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-[var(--color-border)] bg-[var(--color-soft)] text-[var(--color-primary)]"
};

const defaultForms = {
  activity: {
    type: "location_updated",
    priority: "info",
    message: "Ubicacion actualizada en GeoKipu.",
    sector: "La Carolina"
  },
  alerts: {
    type: "gps_disabled",
    priority: "high",
    message: "GPS desactivado o conexion perdida.",
    sector: "La Carolina"
  }
};

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
};

const isAlertEvent = (event) =>
  event.priority === "high" ||
  event.priority === "warning" ||
  ALERT_TYPES.includes(event.type) ||
  GROUP_ALERT_TYPES.includes(event.type);

const matchesActivityFilter = (event, filter) => {
  if (filter === "all") return true;
  if (filter === "location") {
    return ["location_enabled", "location_paused", "location_updated", "sector_changed"].some((type) =>
      event.type?.includes(type)
    );
  }
  if (filter === "security") return isAlertEvent(event) || ["lock_enabled", "pin_updated"].includes(event.type);
  if (filter === "profile") return event.type?.includes("profile");
  if (filter === "groups") return event.type?.startsWith("group_") || event.type?.startsWith("member_");
  if (filter === "system") return ["login", "logout"].includes(event.type);
  return true;
};

const matchesAlertFilter = (event, filter) => {
  if (filter === "all") return true;
  if (filter === "unread") return !event.read;
  if (filter === "high") return event.priority === "high";
  if (filter === "gps") {
    return ["gps_disabled", "gps_denied", "gps_error", "disconnection", "device_offline", "location_paused"].includes(event.type);
  }
  return true;
};

const getEventGroup = (event) => event.groupName || event.group?.name || event.groupId || "";

const ActivityCenter = ({ mode = "activity" }) => {
  const isAlerts = mode === "alerts";
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(defaultForms[mode] || defaultForms.activity);

  const endpoint = isAlerts ? "/alerts" : "/activity";
  const filters = isAlerts ? ALERT_FILTERS : ACTIVITY_FILTERS;

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get(endpoint);
      const nextEvents = data.events || data.alerts || [];
      setEvents(isAlerts ? nextEvents.filter(isAlertEvent) : nextEvents);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilter("all");
    setForm(defaultForms[mode] || defaultForms.activity);
  }, [mode]);

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) =>
        isAlerts ? matchesAlertFilter(event, filter) : matchesActivityFilter(event, filter)
      ),
    [events, filter, isAlerts]
  );

  const counts = useMemo(
    () => ({
      high: events.filter((event) => event.priority === "high").length,
      unread: events.filter((event) => !event.read).length,
      total: events.length
    }),
    [events]
  );

  const createEvent = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      setError("");
      await api.post(endpoint, {
        ...form,
        userId: user?.id,
        userName: user?.fullName || user?.email,
        latitude: -0.1807,
        longitude: -78.4678
      });
      setMessage(isAlerts ? "Alerta registrada correctamente." : "Evento registrado correctamente.");
      await loadEvents();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`${endpoint}/${id}/read`, {});
      await loadEvents();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const removeEvent = async (id) => {
    const confirmed = window.confirm(isAlerts ? "Eliminar esta alerta?" : "Eliminar este evento de bitacora?");
    if (!confirmed) return;

    try {
      await api.delete(`${endpoint}/${id}`);
      await loadEvents();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const contact = (event, contactMode) => {
    const personPhone = event.phone || event.userPhone || user?.phone;
    const personEmail = event.email || event.userEmail || user?.email;

    if (contactMode === "phone") {
      if (!personPhone) {
        setError("No hay telefono registrado para este usuario.");
        return;
      }
      window.location.href = `tel:${personPhone}`;
      return;
    }

    if (!personEmail) {
      setError("No hay correo registrado para este usuario.");
      return;
    }
    window.location.href = `mailto:${personEmail}`;
  };

  if (loading) return <LoadingScreen message={isAlerts ? "Cargando alertas..." : "Cargando bitacora..."} />;

  return (
    <section className="mx-auto grid max-w-6xl gap-7">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
          {isAlerts ? "Alertas importantes" : "Bitacora cronologica"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
          {isAlerts ? "Centro de alertas" : "Historial de actividad"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          {isAlerts
            ? "Eventos warning/high que requieren atencion: GPS desactivado, desconexion, SOS o ubicacion pausada."
            : "Historial completo de login, logout, perfil, ubicacion, grupos, integrantes y eventos de sistema."}
        </p>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {message}
        </div>
      ) : null}

      <SectionHelp
        storageKey={isAlerts ? "geokipu_guide_alerts_seen" : "geokipu_guide_activity_seen"}
        title="Que puedes hacer aqui?"
        description={
          isAlerts
            ? "Aqui aparecen eventos importantes que requieren atencion rapida."
            : "La bitacora guarda el historial completo de acciones y eventos."
        }
        bullets={
          isAlerts
            ? [
                "Revisa alertas de GPS, desconexion o ubicacion pausada.",
                "Usa Llamar o Contactar si necesitas comunicarte.",
                "Marca como leido lo que ya revisaste."
              ]
            : [
                "Revisa inicios de sesion, cambios de perfil y eventos de grupos.",
                "Consulta eventos de ubicacion y seguridad.",
                "Usa filtros para encontrar informacion mas rapido."
              ]
        }
      />

      <form className="glass-card grid gap-4 p-5 lg:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={createEvent}>
        <InputField
          label="Tipo"
          name="type"
          value={form.type}
          onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
        />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">Prioridad</span>
          <select
            className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 focus-ring"
            value={form.priority}
            onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="high">High</option>
          </select>
        </label>
        <InputField
          label="Sector"
          name="sector"
          value={form.sector}
          onChange={(event) => setForm((current) => ({ ...current, sector: event.target.value }))}
        />
        <Button className="self-end" disabled={saving} icon={Plus} type="submit">
          {saving ? "Guardando..." : isAlerts ? "Crear alerta" : "Crear evento"}
        </Button>
        <div className="lg:col-span-4">
          <InputField
            label="Mensaje"
            name="message"
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          />
        </div>
      </form>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="glass-card p-5">
          <p className="text-sm font-bold text-[var(--color-muted)]">{isAlerts ? "Total alertas" : "Eventos"}</p>
          <strong className="mt-2 block text-3xl text-[var(--color-text)]">{counts.total}</strong>
        </article>
        <article className="glass-card p-5">
          <p className="text-sm font-bold text-[var(--color-muted)]">Alta prioridad</p>
          <strong className="mt-2 block text-3xl text-rose-600">{counts.high}</strong>
        </article>
        <article className="glass-card p-5">
          <p className="text-sm font-bold text-[var(--color-muted)]">No leidos</p>
          <strong className="mt-2 block text-3xl text-[var(--color-primary)]">{counts.unread}</strong>
        </article>
      </section>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button
            key={item.key}
            size="sm"
            variant={filter === item.key ? "primary" : "secondary"}
            onClick={() => setFilter(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <section className={isAlerts ? "grid gap-4" : "relative grid gap-4 pl-4 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-px before:bg-[var(--color-border)]"}>
        {filteredEvents.map((event) => (
          <article className="glass-card relative p-5" key={event.id}>
            {!isAlerts ? (
              <span className="absolute -left-[21px] top-7 h-3 w-3 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-background)]" />
            ) : null}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${priorityClasses[event.priority] || priorityClasses.info}`}>
                  {isAlerts ? <BellRing className="h-5 w-5" /> : <ScrollText className="h-5 w-5" />}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-[var(--color-text)]">{event.message}</h2>
                    <span className="rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs font-bold uppercase text-[var(--color-muted)]">
                      {event.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {event.userName || "Usuario"} - {event.type} - {event.sector || "Sin sector"} - {formatDate(event.createdAt)}
                  </p>
                  {getEventGroup(event) ? (
                    <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                      Grupo: {getEventGroup(event)}
                    </p>
                  ) : null}
                  {event.latitude && event.longitude ? (
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      Ultima ubicacion conocida: {event.latitude}, {event.longitude}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {isAlerts ? (
                  <>
                    <Button icon={Phone} size="sm" variant="secondary" onClick={() => contact(event, "phone")}>
                      Llamar
                    </Button>
                    <Button icon={Mail} size="sm" variant="secondary" onClick={() => contact(event, "mail")}>
                      Contactar
                    </Button>
                  </>
                ) : null}
                {!event.read ? (
                  <Button icon={CheckCircle2} size="sm" variant="success" onClick={() => markRead(event.id)}>
                    Leido
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)]">
                    <Clock3 className="h-4 w-4" />
                    Revisado
                  </span>
                )}
                <Button icon={Trash2} size="sm" variant="ghost" onClick={() => removeEvent(event.id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          </article>
        ))}
        {!filteredEvents.length ? (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-sm text-[var(--color-muted)]">
            {isAlerts
              ? "No hay alertas importantes con este filtro."
              : "No hay eventos de bitacora con este filtro."}
          </div>
        ) : null}
      </section>
    </section>
  );
};

export default ActivityCenter;
