import { AlertTriangle, BellRing, CheckCircle2, Mail, Phone, RefreshCw, ScrollText, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { Pill } from "@/components/pill";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { api } from "@/services/api";

type ScreenMode = "alerts" | "activity";

type ActivityEvent = {
  createdAt?: string;
  email?: string;
  groupId?: number | null;
  groupName?: string;
  id: number;
  message: string;
  phone?: string;
  priority: "info" | "warning" | "high";
  read?: boolean;
  sector?: string;
  type: string;
  userEmail?: string;
  userName: string;
  userPhone?: string;
};

type ActivityResponse = {
  alerts?: ActivityEvent[];
  events?: ActivityEvent[];
};

const ALERT_TYPES = [
  "gps_disabled",
  "disconnection",
  "emergency",
  "location_paused",
  "device_offline",
  "sos",
  "group_deleted",
  "member_removed"
];

const ALERT_FILTERS = [
  { key: "all", label: "Todas" },
  { key: "unread", label: "No leidas" },
  { key: "high", label: "Alta" },
  { key: "gps", label: "GPS/desconexion" }
];

const ACTIVITY_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "location", label: "Ubicacion" },
  { key: "security", label: "Seguridad" },
  { key: "profile", label: "Perfil" },
  { key: "groups", label: "Grupos" },
  { key: "system", label: "Sistema" }
];

const isAlertEvent = (event: ActivityEvent) =>
  event.priority === "high" || event.priority === "warning" || ALERT_TYPES.includes(event.type);

const matchesAlertFilter = (event: ActivityEvent, filter: string) => {
  if (filter === "all") return true;
  if (filter === "unread") return !event.read;
  if (filter === "high") return event.priority === "high";
  if (filter === "gps") {
    return ["gps_disabled", "disconnection", "device_offline", "location_paused"].includes(event.type);
  }
  return true;
};

const matchesActivityFilter = (event: ActivityEvent, filter: string) => {
  if (filter === "all") return true;
  if (filter === "location") return event.type.includes("location") || event.type.includes("gps") || event.type.includes("sector");
  if (filter === "security") return isAlertEvent(event);
  if (filter === "profile") return event.type.includes("profile");
  if (filter === "groups") return event.type.startsWith("group_") || event.type.startsWith("member_");
  if (filter === "system") return ["login", "logout"].includes(event.type);
  return true;
};

export function AlertsScreen({ mode = "alerts" }: { mode?: ScreenMode }) {
  const isAlerts = mode === "alerts";
  const { user } = useAuth();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const endpoint = isAlerts ? "/alerts" : "/activity";
  const filters = isAlerts ? ALERT_FILTERS : ACTIVITY_FILTERS;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.get<ActivityResponse>(endpoint);
      const nextEvents = data.events || data.alerts || [];
      setEvents(isAlerts ? nextEvents.filter(isAlertEvent) : nextEvents);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo cargar la informacion.");
    } finally {
      setLoading(false);
    }
  }, [endpoint, isAlerts]);

  useEffect(() => {
    setFilter("all");
    load();
  }, [load]);

  const visibleEvents = useMemo(
    () =>
      events.filter((event) =>
        isAlerts ? matchesAlertFilter(event, filter) : matchesActivityFilter(event, filter)
      ),
    [events, filter, isAlerts]
  );

  const counts = useMemo(
    () => ({
      high: events.filter((event) => event.priority === "high").length,
      total: events.length,
      unread: events.filter((event) => !event.read).length
    }),
    [events]
  );

  const contact = async (event: ActivityEvent, contactMode: "phone" | "mail") => {
    const phone = event.phone || event.userPhone || user?.phone;
    const email = event.email || event.userEmail || user?.email;

    if (contactMode === "phone") {
      if (!phone) {
        setError("No hay telefono registrado para este usuario.");
        return;
      }
      await Linking.openURL(`tel:${phone}`);
      return;
    }

    if (!email) {
      setError("No hay correo registrado para este usuario.");
      return;
    }
    await Linking.openURL(`mailto:${email}`);
  };

  const markRead = async (event: ActivityEvent) => {
    try {
      await api.patch(`${endpoint}/${event.id}/read`, {});
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo marcar como leido.");
    }
  };

  const removeEvent = (event: ActivityEvent) => {
    Alert.alert(isAlerts ? "Eliminar alerta" : "Eliminar evento", event.message, [
      { style: "cancel", text: "Cancelar" },
      {
        style: "destructive",
        text: "Eliminar",
        onPress: async () => {
          try {
            await api.delete(`${endpoint}/${event.id}`);
            await load();
          } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "No se pudo eliminar.");
          }
        }
      }
    ]);
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={isAlerts ? BellRing : ScrollText} tone={isAlerts ? "amber" : "green"}>
          {isAlerts ? "Alertas" : "Bitacora"}
        </Pill>
        <Text style={styles.title}>{isAlerts ? "Centro de alertas" : "Historial cronologico"}</Text>
        <Text muted style={styles.subtitle}>
          {isAlerts
            ? "Solo eventos warning/high: GPS, desconexion, SOS o ubicacion pausada."
            : "Todos los eventos de login, perfil, ubicacion, grupos e integrantes."}
        </Text>
      </View>

      <View style={styles.stats}>
        <Card style={styles.statCard}>
          <Text muted style={styles.statLabel}>{isAlerts ? "Alertas" : "Eventos"}</Text>
          <Text style={styles.statValue}>{counts.total}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text muted style={styles.statLabel}>Alta</Text>
          <Text style={styles.statValue}>{counts.high}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text muted style={styles.statLabel}>No leidas</Text>
          <Text style={styles.statValue}>{counts.unread}</Text>
        </Card>
      </View>

      <View style={styles.filters}>
        {filters.map((item) => (
          <ActionButton
            key={item.key}
            variant={filter === item.key ? "success" : "secondary"}
            onPress={() => setFilter(item.key)}
          >
            {item.label}
          </ActionButton>
        ))}
      </View>

      {loading ? <LoadingView message={isAlerts ? "Cargando alertas..." : "Cargando bitacora..."} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ActionButton icon={RefreshCw} variant="secondary" onPress={load}>
        Actualizar
      </ActionButton>

      <View style={styles.list}>
        {visibleEvents.map((event) => (
          <Card key={event.id} style={styles.alertCard}>
            <View style={[styles.icon, event.priority === "high" ? styles.highIcon : null]}>
              <AlertTriangle color={event.priority === "high" ? colors.danger : colors.alert} size={22} />
            </View>
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>{event.message}</Text>
              <Text muted style={styles.alertText}>
                {event.userName} - {event.type} - {event.sector || "Sin sector"}
              </Text>
              {event.groupName || event.groupId ? (
                <Text muted style={styles.alertText}>
                  Grupo: {event.groupName || event.groupId}
                </Text>
              ) : null}
              <Text muted style={styles.alertText}>
                {event.createdAt ? new Date(event.createdAt).toLocaleString() : "Sin fecha"} - {event.priority}
              </Text>
              <View style={styles.actions}>
                {isAlerts ? (
                  <>
                    <ActionButton icon={Phone} variant="secondary" onPress={() => contact(event, "phone")}>
                      Llamar
                    </ActionButton>
                    <ActionButton icon={Mail} variant="secondary" onPress={() => contact(event, "mail")}>
                      Contactar
                    </ActionButton>
                  </>
                ) : null}
                {!event.read ? (
                  <ActionButton icon={CheckCircle2} variant="success" onPress={() => markRead(event)}>
                    Leido
                  </ActionButton>
                ) : null}
                <ActionButton icon={Trash2} variant="secondary" onPress={() => removeEvent(event)}>
                  Eliminar
                </ActionButton>
              </View>
            </View>
          </Card>
        ))}
        {!loading && visibleEvents.length === 0 ? (
          <Card>
            <Text muted>{isAlerts ? "No hay alertas importantes con este filtro." : "No hay eventos con este filtro."}</Text>
          </Card>
        ) : null}
      </View>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingTop: 12
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 37
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statCard: {
    flex: 1,
    minWidth: 105
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "800"
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  error: {
    color: "#fecaca",
    fontSize: 14,
    fontWeight: "800"
  },
  list: {
    gap: 12
  },
  alertCard: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    borderColor: "rgba(253, 230, 138, 0.22)",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  highIcon: {
    backgroundColor: "rgba(239, 68, 68, 0.18)",
    borderColor: "rgba(254, 202, 202, 0.28)"
  },
  alertBody: {
    flex: 1,
    gap: 7
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: "900"
  },
  alertText: {
    fontSize: 13,
    lineHeight: 19
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
