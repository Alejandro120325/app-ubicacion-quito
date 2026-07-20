import { AlertTriangle, Crosshair, LocateFixed, MapPin, Power, Radio, RefreshCw } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { DetailRow } from "@/components/detail-row";
import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { Pill } from "@/components/pill";
import { SectionHelp } from "@/components/section-help";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { usePersonaData } from "@/hooks/use-dashboard-data";
import { useLiveLocation } from "@/hooks/use-live-location";

const formatCoordinate = (value?: number | null) =>
  Number.isFinite(value) ? Number(value).toFixed(6) : "-";

const formatAccuracy = (value?: number | null) =>
  Number.isFinite(value) ? `${Math.round(Number(value))} m` : "-";

const formatUpdate = (value?: string | Date | null) => {
  if (!value) return "Sin actualizacion";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

const getLocationAddress = (
  location?: { address?: string; sector?: string; latitude?: number; longitude?: number } | null
) => {
  if (location?.address) return location.address;
  if (location?.sector) return location.sector;

  const latitude = location?.latitude;
  const longitude = location?.longitude;
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`
    : "Sin direccion disponible";
};

const statusLabel = {
  active: "Ubicacion real activa",
  demo: "Modo demostracion",
  denied: "Permiso denegado",
  paused: "Ubicacion pausada",
  "permission-pending": "Solicitando permiso",
  "sending-error": "Error al enviar"
};

export function PersonaLocationScreen() {
  const { updateUser, user } = useAuth();
  const { error, groups, loading, location, profile, reload, setProfile } = usePersonaData(user, updateUser);
  const sharing = Boolean(profile?.sharingLocation);
  const {
    error: gpsError,
    isActive,
    lastSentAt,
    liveLocation,
    message,
    pauseLiveLocation,
    refreshNow,
    sending,
    startLiveLocation,
    status
  } = useLiveLocation({
    groupId: groups[0]?.id || null,
    reload,
    setProfile,
    updateUser,
    user
  });
  const displayLocation = liveLocation || location;
  const isRealLocation = displayLocation?.simulated === false || status === "active";
  const statusText = statusLabel[status];
  const screenError = gpsError || error;

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={isRealLocation ? LocateFixed : MapPin} tone={isRealLocation ? "green" : "amber"}>
          Mi ubicacion
        </Pill>
        <Text style={styles.title}>{statusText}</Text>
        <Text muted style={styles.subtitle}>
          Activa GPS real solo cuando quieras compartir tu ubicacion con consentimiento.
        </Text>
      </View>

      <SectionHelp
        storageKey="geokipu_guide_map_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes activar ubicacion real, pausar el seguimiento o mantener el modo demostracion."
        bullets={[
          "GeoKipu pedira permiso de ubicacion al activar GPS real.",
          "La app envia coordenadas mientras esta abierta y en primer plano.",
          "Puedes pausar el seguimiento en cualquier momento."
        ]}
      />

      {screenError ? (
        <Card soft style={styles.notice}>
          <AlertTriangle color="#fde68a" size={18} />
          <Text style={styles.noticeText}>{screenError}</Text>
        </Card>
      ) : null}

      {loading ? <LoadingView message="Cargando ubicacion..." /> : null}

      <SimulatedMap
        height={430}
        lastUpdate={formatUpdate(lastSentAt || displayLocation?.lastUpdate)}
        selectedLabel={displayLocation?.sector}
      />

      <Card style={styles.section}>
        <View style={styles.statusBanner}>
          <Radio color={isRealLocation ? colors.secondary : colors.alert} size={16} />
          <View style={styles.statusBody}>
            <Text style={styles.statusTitle}>{isRealLocation ? "GPS real" : "Modo demostracion"}</Text>
            <Text muted style={styles.statusCaption}>
              {message || (sharing ? "Compartiendo ubicacion." : "Ubicacion pausada.")}
            </Text>
          </View>
        </View>
        <DetailRow
          icon={MapPin}
          label="Ultima ubicacion"
          value={`${displayLocation?.sector || "Ubicacion GPS"} - ${displayLocation?.city || "Quito"}`}
        />
        <DetailRow
          icon={MapPin}
          label="Direccion aproximada"
          value={getLocationAddress(displayLocation)}
        />
        <DetailRow
          icon={LocateFixed}
          label="Coordenadas"
          value={`${formatCoordinate(displayLocation?.latitude)}, ${formatCoordinate(displayLocation?.longitude)}`}
        />
        <DetailRow
          icon={Crosshair}
          label="Precision"
          value={formatAccuracy(displayLocation?.accuracy)}
        />
        <DetailRow
          icon={Power}
          label="Estado"
          value={isActive || sharing ? "Compartiendo" : "Pausado"}
        />
        <DetailRow
          icon={RefreshCw}
          label="Ultima actualizacion"
          value={formatUpdate(lastSentAt || displayLocation?.lastUpdate)}
        />
        <ActionButton
          icon={isActive || sharing ? Power : LocateFixed}
          loading={sending && status === "permission-pending"}
          onPress={isActive || sharing ? pauseLiveLocation : startLiveLocation}
          variant={isActive || sharing ? "dark" : "success"}
        >
          {isActive || sharing ? "Pausar ubicacion" : "Activar ubicacion real"}
        </ActionButton>
        <ActionButton
          icon={RefreshCw}
          loading={sending && status !== "permission-pending"}
          onPress={refreshNow}
          variant="secondary"
        >
          Actualizar ahora
        </ActionButton>
      </Card>
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
  notice: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    padding: 12
  },
  noticeText: {
    color: "#fde68a",
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  section: {
    gap: 12
  },
  statusBanner: {
    alignItems: "flex-start",
    backgroundColor: "rgba(20, 184, 166, 0.11)",
    borderColor: "rgba(45, 212, 191, 0.24)",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    padding: 12
  },
  statusBody: {
    flex: 1,
    gap: 3
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18
  },
  statusCaption: {
    fontSize: 12,
    lineHeight: 17
  }
});
