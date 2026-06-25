import { AlertTriangle, MapPin, Power } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { DetailRow } from "@/components/detail-row";
import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { Pill } from "@/components/pill";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { api } from "@/services/api";
import { usePersonaData } from "@/hooks/use-dashboard-data";
import type { User } from "@/types";

type ShareResponse = {
  sharing: boolean;
  user: User;
};

export function PersonaLocationScreen() {
  const { updateUser, user } = useAuth();
  const { error, loading, location, profile, reload, setProfile } = usePersonaData(user, updateUser);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const sharing = Boolean(profile?.sharingLocation);

  const toggleSharing = async () => {
    try {
      setSaving(true);
      setMessage("");
      const data = await api.patch<ShareResponse>("/location/share", { sharing: !sharing });
      setProfile(data.user);
      await updateUser(data.user);
      setMessage(data.sharing ? "Seguimiento activo." : "Uso compartido pausado.");
      await reload();
    } catch (requestError) {
      setMessage(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible actualizar la ubicacion."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={MapPin} tone={sharing ? "green" : "amber"}>
          Mi ubicacion
        </Pill>
        <Text style={styles.title}>{sharing ? "Seguimiento activo" : "Seguimiento pausado"}</Text>
        <Text muted style={styles.subtitle}>
          Gestiona si tu grupo puede ver tu ubicacion simulada.
        </Text>
      </View>

      {error ? (
        <Card soft style={styles.notice}>
          <AlertTriangle color="#fde68a" size={18} />
          <Text style={styles.noticeText}>{error}</Text>
        </Card>
      ) : null}

      {loading ? <LoadingView message="Cargando ubicacion..." /> : null}

      <SimulatedMap
        height={430}
        lastUpdate={location?.lastUpdate}
        selectedLabel={location?.sector}
      />

      <Card style={styles.section}>
        <DetailRow
          icon={MapPin}
          label="Ultima ubicacion"
          value={`${location?.sector || "La Carolina"} - Quito`}
        />
        <DetailRow
          icon={Power}
          label="Estado"
          value={sharing ? "Compartiendo" : "Pausado"}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <ActionButton
          icon={Power}
          loading={saving}
          onPress={toggleSharing}
          variant={sharing ? "dark" : "success"}
        >
          {sharing ? "Pausar ubicacion" : "Activar ubicacion"}
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
  message: {
    color: "#bfdbfe",
    fontSize: 13,
    fontWeight: "800"
  }
});
