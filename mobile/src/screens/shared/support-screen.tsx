import { AtSign, BriefcaseBusiness, Code2, HelpCircle, PlayCircle } from "lucide-react-native";
import { Linking, StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
import { Text } from "@/components/text";

const INSTAGRAM_URL = "https://instagram.com/";
const GITHUB_URL = "https://github.com/Alejandro120325";
const LINKEDIN_URL = "https://www.linkedin.com/in/jairo-alejandro-ojeda-herrera-9466543a6/";

export function SupportScreen() {
  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={HelpCircle} tone="blue">
          Soporte tecnico
        </Pill>
        <Text style={styles.title}>Ayuda GeoKipu</Text>
        <Text muted style={styles.subtitle}>
          Canales oficiales, reporte de problemas y resumen del proyecto.
        </Text>
      </View>

      <Card elevated style={styles.card}>
        <Text style={styles.cardTitle}>Proyecto</Text>
        <Text muted style={styles.text}>
          GeoKipu es una app academica de ubicacion segura con consentimiento,
          bitacora, alertas, PIN, biometria y contacto rapido.
        </Text>
        <ActionButton icon={PlayCircle} variant="secondary">
          Tutorial disponible al primer ingreso
        </ActionButton>
      </Card>

      <View style={styles.links}>
        <ActionButton icon={AtSign} variant="secondary" onPress={() => Linking.openURL(INSTAGRAM_URL)}>
          Abrir Instagram
        </ActionButton>
        <ActionButton icon={Code2} variant="secondary" onPress={() => Linking.openURL(GITHUB_URL)}>
          Abrir GitHub
        </ActionButton>
        <ActionButton icon={BriefcaseBusiness} variant="secondary" onPress={() => Linking.openURL(LINKEDIN_URL)}>
          Abrir LinkedIn
        </ActionButton>
        <ActionButton icon={HelpCircle} onPress={() => Linking.openURL("mailto:soporte@geokipu.local?subject=Reporte%20GeoKipu")}>
          Reportar problema
        </ActionButton>
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
  card: {
    gap: 12
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900"
  },
  text: {
    fontSize: 14,
    lineHeight: 21
  },
  links: {
    gap: 10
  }
});
