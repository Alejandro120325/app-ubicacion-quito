import { Building2, CircleDollarSign, Code2, Globe2, KeyRound, MapPinned } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { apiFacts } from "@/data/mock-data";

const icons = [Building2, CircleDollarSign, MapPinned, KeyRound];

export function ApiInfoScreen() {
  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={Globe2} tone="blue">
          API futura
        </Pill>
        <Text style={styles.title}>Geoapify Location Platform</Text>
        <Text muted style={styles.subtitle}>
          Informacion de integracion futura. Por ahora la app usa datos simulados.
        </Text>
      </View>

      <View style={styles.grid}>
        {apiFacts.map((fact, index) => {
          const Icon = icons[index] || Code2;

          return (
            <Card key={fact.label} style={styles.fact}>
              <View style={styles.icon}>
                <Icon color={colors.primary} size={21} />
              </View>
              <Text style={styles.factLabel}>{fact.label}</Text>
              <Text muted style={styles.factValue}>
                {fact.value}
              </Text>
            </Card>
          );
        })}
      </View>

      <Card style={styles.note}>
        <Text style={styles.noteTitle}>Aplicacion en Quito</Text>
        <Text muted style={styles.noteText}>
          Geoapify podria resolver geocodificacion, rutas y lugares seguros cercanos.
          La variable documentada en el frontend es VITE_MAP_API_KEY; en mobile se
          mantendra como referencia hasta definir la integracion real.
        </Text>
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
  grid: {
    gap: 12
  },
  fact: {
    gap: 10
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(29, 78, 216, 0.16)",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  factLabel: {
    fontSize: 16,
    fontWeight: "900"
  },
  factValue: {
    fontSize: 13,
    lineHeight: 19
  },
  note: {
    gap: 8
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "900"
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20
  }
});
