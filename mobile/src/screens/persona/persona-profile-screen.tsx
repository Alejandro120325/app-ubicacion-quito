import { Globe2, Mail, Phone, Save, ShieldCheck, UserRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";
import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { Pill } from "@/components/pill";
import { SectionHelp } from "@/components/section-help";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { usePersonaData } from "@/hooks/use-dashboard-data";
import { api } from "@/services/api";
import { saveLocalPin } from "@/services/storage";
import type { User } from "@/types";

type UpdateUserResponse = {
  user: User;
};

export function PersonaProfileScreen() {
  const { updateUser, user } = useAuth();
  const { loading, profile, reload } = usePersonaData(user, updateUser);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("es");
  const [sharing, setSharing] = useState(false);
  const [pin, setPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.fullName || "");
    setPhone(profile.phone || "");
    setLanguage(profile.language || "es");
    setSharing(Boolean(profile.sharingLocation));
  }, [profile]);

  const save = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (pin && !/^\d{4,6}$/.test(pin)) {
        setError("El PIN debe tener entre 4 y 6 digitos.");
        return;
      }

      const data = await api.patch<UpdateUserResponse>(`/users/${user.id}`, {
        fullName,
        phone,
        language
      });

      if (pin) {
        await saveLocalPin(pin);
        setPin("");
      }

      await api.patch("/location/share", { sharing });
      await api.post("/activity", {
        type: "profile_updated",
        priority: "info",
        message: "El usuario actualizo su perfil desde mobile.",
        userId: user.id,
        userName: fullName
      });

      await updateUser(data.user);
      await reload();
      setMessage("Perfil actualizado correctamente.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo guardar perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={UserRound} tone="blue">
          Perfil
        </Pill>
        <Text style={styles.title}>{profile?.fullName || "Perfil GeoKipu"}</Text>
        <Text muted style={styles.subtitle}>
          Edita datos, privacidad y PIN local para proteger ubicaciones.
        </Text>
      </View>

      <SectionHelp
        storageKey="geokipu_guide_profile_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes administrar tus datos personales y opciones de seguridad."
        bullets={[
          "Actualiza nombre, telefono e idioma.",
          "Configura PIN local o privacidad si esta disponible.",
          "Revisa tu estado de ubicacion compartida."
        ]}
      />

      {loading ? <LoadingView message="Cargando perfil..." /> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Card elevated style={styles.card}>
        <Pill icon={ShieldCheck} tone={sharing ? "green" : "amber"}>
          {sharing ? "Compartiendo ubicacion" : "Ubicacion pausada"}
        </Pill>

        <FormField icon={UserRound} label="Nombre completo" value={fullName} onChangeText={setFullName} />
        <FormField icon={Mail} label="Correo" editable={false} value={profile?.email || ""} />
        <FormField icon={Phone} keyboardType="phone-pad" label="Telefono" value={phone} onChangeText={setPhone} />
        <FormField icon={Globe2} label="Idioma" value={language} onChangeText={setLanguage} />
        <FormField
          helperText="PIN de 4 a 6 digitos. Se guarda protegido en SecureStore."
          keyboardType="number-pad"
          label="PIN local"
          maxLength={6}
          password
          value={pin}
          onChangeText={(value) => setPin(value.replace(/\D/g, ""))}
        />

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchTitle}>Compartir ubicacion</Text>
            <Text muted style={styles.switchHelp}>
              Activa o pausa el rastreo GPS consentido.
            </Text>
          </View>
          <Switch
            thumbColor={sharing ? colors.secondary : colors.faint}
            value={sharing}
            onValueChange={setSharing}
          />
        </View>

        <ActionButton icon={Save} loading={saving} onPress={save}>
          Guardar perfil
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
  card: {
    gap: 14
  },
  success: {
    color: "#bbf7d0",
    fontSize: 14,
    fontWeight: "800"
  },
  error: {
    color: "#fecaca",
    fontSize: 14,
    fontWeight: "800"
  },
  switchRow: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: colors.glassBorder,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 12
  },
  switchText: {
    flex: 1,
    gap: 3
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: "900"
  },
  switchHelp: {
    fontSize: 13
  }
});
