import { useRouter } from "expo-router";
import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { demoCredentials } from "@/data/mock-data";
import { validateLoginForm, type FieldErrors } from "@/utils/validators";

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const isReady = useMemo(
    () => form.email.trim().length > 0 && form.password.trim().length > 0,
    [form.email, form.password]
  );

  const updateField = (name: "email" | "password", value: string) => {
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setErrors(validateLoginForm(nextForm));
    setServerError("");
  };

  const fillDemo = (credential: (typeof demoCredentials)[number]) => {
    const nextForm = { email: credential.email, password: credential.password };
    setForm(nextForm);
    setErrors(validateLoginForm(nextForm));
    setServerError("");
  };

  const submit = async () => {
    const validation = validateLoginForm(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);
      setServerError("");
      const user = await login(form);
      router.replace(user.role === "admin" ? "/admin" : "/persona");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No fue posible iniciar sesion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={ShieldCheck} tone="green">
          Acceso seguro
        </Pill>
        <Text style={styles.title}>Iniciar sesion</Text>
        <Text muted style={styles.subtitle}>
          Entra con tu cuenta de administrador o persona para ver tu panel movil.
        </Text>
      </View>

      <Card elevated style={styles.formCard}>
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          icon={Mail}
          keyboardType="email-address"
          label="Correo"
          onChangeText={(value) => updateField("email", value)}
          placeholder="correo@ejemplo.com"
          value={form.email}
        />
        <FormField
          error={errors.password}
          label="Contrasena"
          onChangeText={(value) => updateField("password", value)}
          password
          placeholder="Minimo 8 caracteres"
          value={form.password}
        />

        {serverError ? (
          <Card soft style={styles.errorBox}>
            <Text style={styles.errorText}>{serverError}</Text>
          </Card>
        ) : null}

        <ActionButton
          disabled={!isReady}
          icon={KeyRound}
          loading={loading}
          onPress={submit}
        >
          Iniciar sesion
        </ActionButton>
      </Card>

      <Card style={styles.demoCard}>
        <View style={styles.demoTitle}>
          <UserRound color={colors.primary} size={18} />
          <Text style={styles.demoHeading}>Credenciales de prueba</Text>
        </View>
        <View style={styles.demoList}>
          {demoCredentials.map((credential) => (
            <Pressable
              accessibilityRole="button"
              key={credential.email}
              onPress={() => fillDemo(credential)}
              style={({ pressed }) => [styles.demoItem, pressed ? styles.pressed : null]}
            >
              <Text style={styles.demoRole}>{credential.role}</Text>
              <Text muted style={styles.demoText}>
                {credential.email}
              </Text>
              <Text muted style={styles.demoText}>
                {credential.password}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <SimulatedMap height={300} />

      <ActionButton onPress={() => router.push("/register")} variant="secondary">
        Crear cuenta persona
      </ActionButton>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingTop: 12
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22
  },
  formCard: {
    gap: 16
  },
  errorBox: {
    borderColor: "rgba(239, 68, 68, 0.45)",
    padding: 12
  },
  errorText: {
    color: "#fecaca",
    fontSize: 13,
    fontWeight: "800"
  },
  demoCard: {
    gap: 13
  },
  demoTitle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  demoHeading: {
    fontWeight: "900"
  },
  demoList: {
    gap: 10
  },
  demoItem: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
    padding: 12
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
  },
  demoRole: {
    fontSize: 14,
    fontWeight: "900"
  },
  demoText: {
    fontSize: 12,
    lineHeight: 17
  }
});
