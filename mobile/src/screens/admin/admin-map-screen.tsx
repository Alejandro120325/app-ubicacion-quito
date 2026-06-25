import { LocateFixed } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";

export function AdminMapScreen() {
  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={LocateFixed} tone="blue">
          Mapa
        </Pill>
        <Text style={styles.title}>Mapa simulado de Quito</Text>
        <Text muted style={styles.subtitle}>
          Marcadores visuales para La Carolina, Cumbaya, Centro Historico, Universidad y Quitumbe.
        </Text>
      </View>

      <SimulatedMap height={430} showConnections />

      <Card style={styles.status}>
        <Text style={styles.statusTitle}>Estado</Text>
        <View style={styles.statusRows}>
          {["Ubicacion simulada", "Seguimiento activo", "Actualizado hace unos segundos"].map(
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
