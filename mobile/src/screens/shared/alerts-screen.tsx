import { AlertTriangle, BellRing } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { alerts } from "@/data/mock-data";

export function AlertsScreen() {
  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={BellRing} tone="amber">
          Alertas
        </Pill>
        <Text style={styles.title}>Alertas simuladas</Text>
        <Text muted style={styles.subtitle}>
          Eventos de prueba para revisar estados pausados, inactivos o sin conexion.
        </Text>
      </View>

      <View style={styles.list}>
        {alerts.map((alert) => (
          <Card key={alert.title} style={styles.alertCard}>
            <View style={styles.icon}>
              <AlertTriangle color={colors.alert} size={22} />
            </View>
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text muted style={styles.alertText}>
                {alert.body}
              </Text>
              <Pill tone={alert.tone === "warning" ? "amber" : "blue"}>{alert.time}</Pill>
            </View>
          </Card>
        ))}
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
  list: {
    gap: 12
  },
  alertCard: {
    alignItems: "flex-start",
    borderColor: "rgba(245, 158, 11, 0.38)",
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
  }
});
