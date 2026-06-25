import { Link } from "expo-router";
import { ArrowRight, MapPinned, Radar, UserPlus } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";

export function WelcomeScreen() {
  return (
    <GradientScreen>
      <View style={styles.hero}>
        <Pill icon={Radar} tone="blue">
          Ubicacion consentida
        </Pill>
        <Text style={styles.title}>Quito Ubicacion Segura</Text>
        <Text style={styles.subtitle}>
          Comparte tu ubicacion de forma segura en Quito y alrededores.
        </Text>
        <Text muted style={styles.body}>
          Un panel movil para personas y administradores con datos simulados,
          grupos familiares y seguimiento visual inspirado en la version web.
        </Text>
      </View>

      <View style={styles.actions}>
        <Link asChild href="/login">
          <ActionButton icon={ArrowRight}>Iniciar sesion</ActionButton>
        </Link>
        <Link asChild href="/register">
          <ActionButton icon={UserPlus} variant="secondary">
            Crear cuenta
          </ActionButton>
        </Link>
      </View>

      <View style={styles.stats}>
        {[
          ["2", "roles"],
          ["100%", "datos simulados"],
          ["Quito", "ciudad base"]
        ].map(([value, label]) => (
          <Card key={label} style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text muted style={styles.statLabel}>
              {label}
            </Text>
          </Card>
        ))}
      </View>

      <Card elevated style={styles.mapFrame}>
        <View style={styles.mapHeader}>
          <View>
            <Text muted style={styles.mapMeta}>
              Circulo simulado
            </Text>
            <Text style={styles.mapTitle}>Familia</Text>
          </View>
          <Pill tone="green">Activo</Pill>
        </View>
        <SimulatedMap height={360} showConnections />
      </Card>

      <Card style={styles.notice}>
        <MapPinned color={colors.secondary} size={22} />
        <View style={styles.noticeText}>
          <Text style={styles.noticeTitle}>Sin mapas reales todavia</Text>
          <Text muted style={styles.noticeBody}>
            La app usa marcadores visuales hasta integrar Geoapify u otra plataforma.
          </Text>
        </View>
      </Card>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 14,
    paddingTop: 18
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 44
  },
  subtitle: {
    color: "#e0f2fe",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 26
  },
  body: {
    fontSize: 15,
    lineHeight: 23
  },
  actions: {
    gap: 10
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statCard: {
    flex: 1,
    minWidth: 96,
    padding: 13
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 2
  },
  mapFrame: {
    gap: 12,
    padding: 12
  },
  mapHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  mapMeta: {
    fontSize: 12,
    lineHeight: 16
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "900"
  },
  notice: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12
  },
  noticeText: {
    flex: 1,
    gap: 3
  },
  noticeTitle: {
    fontWeight: "900"
  },
  noticeBody: {
    fontSize: 13,
    lineHeight: 19
  }
});
