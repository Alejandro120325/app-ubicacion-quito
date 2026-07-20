import { LocateFixed } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
import { SectionHelp } from "@/components/section-help";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";
import { mapMarkers } from "@/data/mock-data";
import { useAdminData } from "@/hooks/use-dashboard-data";
import type { LocationStatus, User } from "@/types";

const getLocationStatus = (person: User): LocationStatus => {
  if (person.sharingLocation) return "sharing";
  if (person.active) return "paused";
  return "offline";
};

export function AdminMapScreen() {
  const { people } = useAdminData();
  const realCount = people.filter((person) => person.lastLocation?.simulated === false).length;
  const points = useMemo(
    () =>
      people.map((person, index) => ({
        label: person.lastLocation?.sector || person.fullName,
        active: person.sharingLocation,
        left: mapMarkers[index % mapMarkers.length].left,
        locationStatus: getLocationStatus(person),
        top: mapMarkers[index % mapMarkers.length].top
      })),
    [people]
  );

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={LocateFixed} tone="blue">
          Mapa
        </Pill>
        <Text style={styles.title}>Mapa de ubicacion</Text>
        <Text muted style={styles.subtitle}>
          Marcadores de referencia para La Carolina, Cumbaya, Centro Historico, Universidad y Quitumbe.
        </Text>
      </View>

      <SectionHelp
        storageKey="geokipu_guide_map_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes visualizar la ubicacion compartida o el modo demostracion de GeoKipu."
        bullets={[
          "Revisa la ultima ubicacion disponible.",
          "Identifica sectores importantes en el mapa.",
          "Activa o pausa el seguimiento con consentimiento."
        ]}
      />

      <SimulatedMap height={430} points={points} showConnections />

      <Card style={styles.status}>
        <Text style={styles.statusTitle}>Estado</Text>
        <View style={styles.statusRows}>
          {[
            realCount ? `GPS real: ${realCount}` : "Modo demostracion activo",
            "Seguimiento activo",
            "Actualizado hace unos segundos"
          ].map(
            (item) => (
              <Pill key={item} tone={item === "Seguimiento activo" ? "green" : "muted"}>
                {item}
              </Pill>
            )
          )}
        </View>
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
  status: {
    gap: 12
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "900"
  },
  statusRows: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
