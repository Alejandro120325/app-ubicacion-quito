import {
  AtSign,
  BriefcaseBusiness,
  Code2,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  UsersRound
} from "lucide-react-native";
import { Alert, Linking, StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
import { SectionHelp } from "@/components/section-help";
import { Text } from "@/components/text";
import { geokipuContact, geokipuSocialLinks, geokipuTeam } from "@/constants/contact";
import { colors } from "@/constants/theme";

export function SupportScreen() {
  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={HelpCircle} tone="blue">
          Soporte
        </Pill>
        <Text style={styles.title}>Ayuda GeoKipu</Text>
        <Text muted style={styles.subtitle}>
          Soporte técnico y datos institucionales en una sola pantalla.
        </Text>
      </View>

      <SectionHelp
        storageKey="geokipu_guide_support_seen"
        title="Qué puedes hacer aquí?"
        description="Primero tienes acciones de ayuda; más abajo está Acerca de nosotros."
        bullets={[
          "Reporta problemas de la aplicación.",
          "Usa correo, llamada o tutorial.",
          "Consulta equipo, redes y oficinas sin saturar la barra inferior."
        ]}
      />

      <Text style={styles.sectionEyebrow}>Soporte técnico</Text>

      <Card elevated style={styles.card}>
        <Text style={styles.cardTitle}>Guía de uso</Text>
        <Text muted style={styles.text}>
          Revisa el flujo general para recordar dónde están mapa, grupos, alertas, bitácora y perfil.
        </Text>
        <ActionButton
          icon={PlayCircle}
          variant="secondary"
          onPress={() =>
            Alert.alert(
              "Ayuda general",
              "GeoKipu permite revisar grupos, mapa, alertas, bitácora, perfil y soporte. La ubicación se comparte solo con consentimiento."
            )
          }
        >
          Ver ayuda general
        </ActionButton>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Reportar problema</Text>
        <Text muted style={styles.text}>
          Indica qué pantalla falló, el usuario de prueba y los pasos para reproducirlo.
        </Text>
        <ActionButton icon={HelpCircle} onPress={() => Linking.openURL(`${geokipuContact.emailUrl}?subject=Reporte%20GeoKipu`)}>
          Reportar problema
        </ActionButton>
        <View style={styles.contactActions}>
          <ActionButton icon={Mail} variant="secondary" onPress={() => Linking.openURL(geokipuContact.emailUrl)}>
            Correo
          </ActionButton>
          <ActionButton icon={Phone} variant="secondary" onPress={() => Linking.openURL(geokipuContact.phoneUrl)}>
            Llamar
          </ActionButton>
        </View>
      </Card>

      <Text style={styles.sectionEyebrow}>Acerca de nosotros</Text>

      <Card style={styles.card}>
        <View style={styles.sectionTitle}>
          <UsersRound color={colors.secondary} size={20} />
          <Text style={styles.cardTitle}>Equipo del proyecto</Text>
        </View>
        <View style={styles.memberList}>
          {geokipuTeam.map((member) => (
            <View key={member} style={styles.memberItem}>
              <Text style={styles.memberName}>{member}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionTitle}>
          <BriefcaseBusiness color={colors.secondary} size={20} />
          <Text style={styles.cardTitle}>GeoKipu</Text>
        </View>
        <View style={styles.contactRows}>
          <Text style={styles.companyName}>{geokipuContact.company}</Text>
          <View style={styles.contactRow}>
            <Mail color={colors.muted} size={18} />
            <Text muted style={styles.contactText}>{geokipuContact.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Phone color={colors.muted} size={18} />
            <Text muted style={styles.contactText}>{geokipuContact.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <MapPin color={colors.muted} size={18} />
            <Text muted style={styles.contactText}>{geokipuContact.address}</Text>
          </View>
          <Text muted style={styles.text}>{geokipuContact.schedule}</Text>
        </View>
        <ActionButton icon={MapPin} onPress={() => Linking.openURL(geokipuContact.mapsUrl)}>
          Ver oficinas en Google Maps
        </ActionButton>
      </Card>

      <View style={styles.links}>
        {geokipuSocialLinks.map((link) => {
          const Icon = link.label === "Instagram" ? AtSign : link.label === "LinkedIn" ? BriefcaseBusiness : Code2;
          return (
            <ActionButton key={link.label} icon={Icon} variant="secondary" onPress={() => Linking.openURL(link.url)}>
              Abrir {link.label}
            </ActionButton>
          );
        })}
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
  sectionEyebrow: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  card: {
    gap: 12
  },
  sectionTitle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900"
  },
  text: {
    fontSize: 14,
    lineHeight: 21
  },
  companyName: {
    fontSize: 15,
    fontWeight: "900"
  },
  memberList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  memberItem: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: colors.glassBorder,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  memberName: {
    fontSize: 14,
    fontWeight: "800"
  },
  contactRows: {
    gap: 10
  },
  contactRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 9
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  contactActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  links: {
    gap: 10
  }
});
