import { Globe2, IdCard, Mail, Phone, ShieldCheck, UserRound } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { DetailRow } from "@/components/detail-row";
import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { Pill } from "@/components/pill";
import { Text } from "@/components/text";
import { useAuth } from "@/context/auth-context";
import { usePersonaData } from "@/hooks/use-dashboard-data";

export function PersonaProfileScreen() {
  const { updateUser, user } = useAuth();
  const { loading, profile } = usePersonaData(user, updateUser);

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={UserRound} tone="blue">
          Perfil
        </Pill>
        <Text style={styles.title}>{profile?.fullName || "Persona Demo Quito"}</Text>
        <Text muted style={styles.subtitle}>
          Informacion personal registrada para la app de ubicacion segura.
        </Text>
      </View>

      {loading ? <LoadingView message="Cargando perfil..." /> : null}

      <Card elevated style={styles.card}>
        <Pill icon={ShieldCheck} tone={profile?.sharingLocation ? "green" : "amber"}>
          {profile?.sharingLocation ? "Compartiendo ubicacion" : "Ubicacion pausada"}
        </Pill>
        <DetailRow icon={UserRound} label="Nombres completos" value={profile?.fullName || "Sin datos"} />
        <DetailRow icon={Mail} label="Correo" value={profile?.email || "Sin datos"} />
        <DetailRow icon={IdCard} label="Cedula ecuatoriana" value={profile?.cedula || "Sin datos"} />
        <DetailRow icon={Phone} label="Telefono" value={profile?.phone || "Sin datos"} />
        <DetailRow
          icon={Globe2}
          label="Idioma"
          value={profile?.language === "en" ? "English" : "Espanol"}
        />
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
  card: {
    gap: 12
  }
});
