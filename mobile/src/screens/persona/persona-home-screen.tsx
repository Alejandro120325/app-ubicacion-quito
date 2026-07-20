import { AlertTriangle, BadgeCheck, HeartHandshake, IdCard, Mail, MapPin, Phone, ShieldCheck, UsersRound } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { DetailRow } from "@/components/detail-row";
import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { MemberCard } from "@/components/member-card";
import { Pill } from "@/components/pill";
import { SectionHelp } from "@/components/section-help";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { usePersonaData } from "@/hooks/use-dashboard-data";

export function PersonaHomeScreen() {
  const { updateUser, user } = useAuth();
  const { error, groups, loading, location, profile } = usePersonaData(user, updateUser);
  const mainGroup = groups[0];
  const sharing = Boolean(profile?.sharingLocation);
  const realLocation = location?.simulated === false;

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={BadgeCheck} tone="green">
          Panel persona
        </Pill>
        <Text style={styles.title}>Hola, {profile?.fullName || "Persona Demo Quito"}</Text>
        <Text muted style={styles.subtitle}>
          Controla tu ubicacion compartida y revisa tu grupo familiar.
        </Text>
      </View>

      <SectionHelp
        storageKey="geokipu_guide_persona_seen"
        title="Que puedes hacer aqui?"
        description="Este panel muestra tu estado personal, tus grupos y accesos rapidos de seguridad."
        bullets={[
          "Revisa si tu ubicacion esta compartida.",
          "Accede a tus grupos y privacidad.",
          "Entra al perfil para actualizar tus datos."
        ]}
      />

      {error ? (
        <Card soft style={styles.notice}>
          <AlertTriangle color="#fde68a" size={18} />
          <Text style={styles.noticeText}>{error}</Text>
        </Card>
      ) : null}

      {loading ? <LoadingView message="Cargando panel persona..." /> : null}

      <Card elevated style={styles.statusCard}>
        <View style={styles.statusTop}>
          <View style={styles.statusText}>
            <Text muted style={styles.eyebrow}>
              Estado actual
            </Text>
            <Text style={styles.statusTitle}>{sharing ? "Compartiendo" : "Pausado"}</Text>
            <Text muted style={styles.statusBody}>
              {sharing
                ? realLocation
                  ? "Tu ubicacion GPS real esta disponible para tu grupo."
                  : "Tu ubicacion de referencia esta disponible para tu grupo."
                : "El uso compartido esta pausado en este momento."}
            </Text>
          </View>
          <View style={[styles.pin, sharing ? styles.pinActive : null]}>
            <MapPin color={sharing ? colors.background : colors.text} size={30} />
          </View>
        </View>
        <SimulatedMap
          height={310}
          lastUpdate={location?.lastUpdate}
          selectedLabel={location?.sector}
        />
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Mi cuenta</Text>
            <Text muted style={styles.sectionText}>
              Datos principales registrados para la persona.
            </Text>
          </View>
          <ShieldCheck color={colors.secondary} size={24} />
        </View>
        <DetailRow icon={Mail} label="Correo" value={profile?.email || "Sin datos"} />
        <DetailRow icon={Phone} label="Telefono" value={profile?.phone || "Sin datos"} />
        <DetailRow icon={IdCard} label="Cedula" value={profile?.cedula || "Sin datos"} />
      </Card>

      {mainGroup ? (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Mi grupo</Text>
              <Text muted style={styles.sectionText}>
                {mainGroup.name} con {mainGroup.members.length} integrantes.
              </Text>
            </View>
            <UsersRound color={colors.primary} size={24} />
          </View>
          <SimulatedMap
            height={300}
            points={mainGroup.members.map((member) => ({
              label: member.fullName,
              left: member.left,
              locationStatus: member.locationStatus,
              top: member.top
            }))}
            showConnections
          />
          <View style={styles.members}>
            {mainGroup.members.slice(0, 3).map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </View>
          <ActionButton icon={HeartHandshake} variant="secondary">
            Ver grupo familiar
          </ActionButton>
        </Card>
      ) : null}
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
  statusCard: {
    gap: 14
  },
  statusTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between"
  },
  statusText: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    color: "#bae6fd",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  statusTitle: {
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 34
  },
  statusBody: {
    fontSize: 13,
    lineHeight: 19
  },
  pin: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    height: 62,
    justifyContent: "center",
    width: 62
  },
  pinActive: {
    backgroundColor: colors.secondary
  },
  section: {
    gap: 12
  },
  sectionHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900"
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2
  },
  members: {
    gap: 10
  }
});
