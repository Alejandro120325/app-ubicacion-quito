import { useRouter } from "expo-router";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
  UserRound
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";
import { GradientScreen } from "@/components/gradient-screen";
import { Pill } from "@/components/pill";
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
      setServerError(error instanceof Error ? error.message : "No fue posible iniciar sesión.");
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
        <Text style={styles.title}>Quito Ubicación Segura</Text>
        <Text muted style={styles.subtitle}>
          Ingresa con una cuenta de administrador o persona para continuar.
        </Text>
      </View>

      <Card elevated style={styles.formCard}>
        <View style={styles.formHeader}>
          <View style={styles.formIcon}>
            <KeyRound color={colors.white} size={20} />
          </View>
          <View style={styles.formTitleBlock}>
            <Text style={styles.formTitle}>Iniciar sesión</Text>
            <Text muted style={styles.formSubtitle}>
              Acceso validado de forma segura.
            </Text>
          </View>
        </View>

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
          label="Contraseña"
          onChangeText={(value) => updateField("password", value)}
          password
          placeholder="Mínimo 8 caracteres"
          value={form.password}
        />

        {serverError ? (
          <View style={styles.errorBox}>
            <AlertCircle color="#fecaca" size={18} />
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>No se pudo iniciar sesión</Text>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          </View>
        ) : null}

        <ActionButton
          disabled={!isReady}
          icon={KeyRound}
          loading={loading}
          onPress={submit}
        >
          Iniciar sesión
        </ActionButton>

      </Card>

      <Card style={styles.demoCard}>
        <View style={styles.demoTitle}>
          <UserRound color={colors.primary} size={18} />
          <View style={styles.demoTitleCopy}>
            <Text style={styles.demoHeading}>Credenciales de prueba</Text>
            <Text muted style={styles.demoSubheading}>
              Toca una tarjeta para completar el formulario.
            </Text>
          </View>
        </View>
        <View style={styles.demoList}>
          {demoCredentials.map((credential) => (
            <Pressable
              accessibilityRole="button"
              key={credential.email}
              onPress={() => fillDemo(credential)}
              style={({ pressed }) => [styles.demoItem, pressed ? styles.pressed : null]}
            >
              <View style={styles.demoContent}>
                <Text style={styles.demoRole}>{credential.role}</Text>
                <Text muted style={styles.demoText}>
                  {credential.email}
                </Text>
              </View>
              <View style={styles.demoAction}>
                <CheckCircle2 color={colors.secondary} size={18} />
              </View>
            </Pressable>
          ))}
        </View>
      </Card>

      <ActionButton onPress={() => router.push("/register")} variant="secondary">
        Crear cuenta persona
      </ActionButton>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
    paddingTop: 18
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22
  },
  formCard: {
    gap: 16,
    padding: 18
  },
  formHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  formIcon: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderCurve: "continuous",
    borderRadius: 10,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  formTitleBlock: {
    flex: 1,
    gap: 2
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 25
  },
  formSubtitle: {
    fontSize: 12,
    lineHeight: 17
  },
  errorBox: {
    alignItems: "flex-start",
    backgroundColor: "rgba(127, 29, 29, 0.32)",
    borderColor: "rgba(239, 68, 68, 0.45)",
    borderCurve: "continuous",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 12
  },
  errorContent: {
    flex: 1,
    gap: 3
  },
  errorTitle: {
    color: "#fee2e2",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17
  },
  errorText: {
    color: "#fecaca",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17
  },
  demoCard: {
    gap: 13,
    padding: 16
  },
  demoTitle: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8
  },
  demoTitleCopy: {
    flex: 1,
    gap: 2
  },
  demoHeading: {
    fontWeight: "900",
    lineHeight: 19
  },
  demoSubheading: {
    fontSize: 12,
    lineHeight: 16
  },
  demoList: {
    gap: 8
  },
  demoItem: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.055)",
    borderColor: colors.glassBorder,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 3,
    justifyContent: "space-between",
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
  demoContent: {
    flex: 1,
    gap: 3
  },
  demoText: {
    fontSize: 12,
    lineHeight: 17
  },
  demoAction: {
    alignItems: "center",
    backgroundColor: "rgba(20, 184, 166, 0.18)",
    borderColor: "rgba(153, 246, 228, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34
  }
});
