import { useRouter } from "expo-router";
import { BadgeCheck, IdCard, Mail, Phone, ShieldCheck, UserRound } from "lucide-react-native";
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
import type { RegisterPayload } from "@/types";
import {
  passwordScore,
  validateRegisterForm,
  type FieldErrors
} from "@/utils/validators";

const initialForm: RegisterPayload = {
  cedula: "",
  confirmPassword: "",
  email: "",
  fullName: "",
  language: "es",
  password: "",
  phone: ""
};

const strengthLabels = ["Sin datos", "Debil", "Basica", "Buena", "Fuerte"];

export function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => passwordScore(form.password), [form.password]);

  const updateField = (name: keyof RegisterPayload, value: string) => {
    const nextForm = { ...form, [name]: value };
    const hasData = Object.values(nextForm).some((field) => field.trim().length > 0);

    setForm(nextForm);
    setErrors(hasData ? validateRegisterForm(nextForm) : {});
    setMessage("");
  };

  const submit = async () => {
    const validation = validateRegisterForm(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);
      await register(form);
      setMessage("Cuenta creada correctamente. Ahora inicia sesion.");
      setTimeout(() => router.replace("/login"), 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={BadgeCheck} tone="green">
          Registro persona
        </Pill>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text muted style={styles.subtitle}>
          El rol se asigna automaticamente como PERSONA para mantener el flujo del backend.
        </Text>
      </View>

      <Card elevated style={styles.formCard}>
        <FormField
          error={errors.fullName}
          icon={UserRound}
          label="Nombres completos"
          onChangeText={(value) => updateField("fullName", value)}
          placeholder="Persona Demo Quito"
          value={form.fullName}
        />
        <FormField
          autoCapitalize="none"
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
        <FormField
          error={errors.confirmPassword}
          label="Confirmar contrasena"
          onChangeText={(value) => updateField("confirmPassword", value)}
          password
          placeholder="Repite tu contrasena"
          value={form.confirmPassword}
        />

        <Card soft style={styles.strength}>
          <View style={styles.strengthTop}>
            <View style={styles.strengthLabel}>
              <ShieldCheck color={colors.primary} size={17} />
              <Text style={styles.strengthTitle}>Seguridad de contrasena</Text>
            </View>
            <Text muted style={styles.strengthText}>
              {strengthLabels[score]}
            </Text>
          </View>
          <View style={styles.meter}>
            <View style={[styles.meterFill, { width: `${Math.max(12, (score / 4) * 100)}%` }]} />
          </View>
          <View style={styles.rules}>
            {[
              ["8 caracteres", score >= 1],
              ["Mayuscula", /[A-Z]/.test(form.password)],
              ["Minuscula", /[a-z]/.test(form.password)],
              ["Numero", /\d/.test(form.password)]
            ].map(([label, passed]) => (
              <View key={String(label)} style={[styles.rule, passed ? styles.rulePass : null]}>
                <Text selectable={false} style={[styles.ruleText, passed ? styles.ruleTextPass : null]}>
                  {String(label)}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.language}>
          <Text style={styles.languageLabel}>Idioma</Text>
          <View style={styles.languageOptions}>
            {[
              ["es", "Espanol"],
              ["en", "English"]
            ].map(([value, label]) => (
              <Pressable
                accessibilityRole="button"
                key={value}
                onPress={() => updateField("language", value)}
                style={[
                  styles.languageButton,
                  form.language === value ? styles.languageActive : null
                ]}
              >
                <Text
                  selectable={false}
                  style={[
                    styles.languageText,
                    form.language === value ? styles.languageTextActive : null
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
          {errors.language ? <Text style={styles.error}>{errors.language}</Text> : null}
        </View>

        <FormField
          error={errors.cedula}
          helperText="Debe tener 10 digitos."
          icon={IdCard}
          keyboardType="number-pad"
          label="Cedula ecuatoriana"
          maxLength={10}
          onChangeText={(value) => updateField("cedula", value)}
          placeholder="1710000009"
          value={form.cedula}
        />
        <FormField
          error={errors.phone}
          helperText="Debe iniciar con 09 y tener 10 digitos."
          icon={Phone}
          keyboardType="phone-pad"
          label="Telefono"
          maxLength={10}
          onChangeText={(value) => updateField("phone", value)}
          placeholder="0991234567"
          value={form.phone}
        />

        {message ? (
          <Card soft style={styles.message}>
            <Text style={styles.messageText}>{message}</Text>
          </Card>
        ) : null}

        <ActionButton icon={BadgeCheck} loading={loading} onPress={submit} variant="success">
          Crear cuenta
        </ActionButton>
      </Card>

      <ActionButton onPress={() => router.back()} variant="secondary">
        Volver
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
  strength: {
    gap: 12,
    padding: 12
  },
  strengthTop: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  strengthLabel: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8
  },
  strengthTitle: {
    fontSize: 13,
    fontWeight: "900"
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "800"
  },
  meter: {
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    borderRadius: 999,
    height: 8,
    overflow: "hidden"
  },
  meterFill: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    height: "100%"
  },
  rules: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  rule: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: colors.glassBorder,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  rulePass: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderColor: "rgba(187, 247, 208, 0.22)"
  },
  ruleText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 14
  },
  ruleTextPass: {
    color: "#bbf7d0"
  },
  language: {
    gap: 8
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: "800"
  },
  languageOptions: {
    flexDirection: "row",
    gap: 10
  },
  languageButton: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: colors.glassBorder,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  languageActive: {
    backgroundColor: "rgba(20, 184, 166, 0.18)",
    borderColor: colors.secondary
  },
  languageText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
  },
  languageTextActive: {
    color: "#99f6e4"
  },
  error: {
    color: "#fca5a5",
    fontSize: 13,
    fontWeight: "700"
  },
  message: {
    padding: 12
  },
  messageText: {
    color: "#fde68a",
    fontSize: 13,
    fontWeight: "800"
  }
});
