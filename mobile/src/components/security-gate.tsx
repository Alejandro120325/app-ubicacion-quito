import * as LocalAuthentication from "expo-local-authentication";
import { LockKeyhole, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { AppState, Modal, StyleSheet, TextInput, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { Text } from "@/components/text";
import { colors, radii } from "@/constants/theme";
import { onboardingSteps } from "@/constants/onboarding";
import { useAuth } from "@/context/auth-context";
import {
  hasCompletedOnboarding,
  hasLocalPin,
  markOnboardingComplete,
  saveLocalPin,
  verifyLocalPin
} from "@/services/storage";

type Mode = "onboarding" | "create-pin" | "locked" | null;

export function SecurityGate() {
  const { isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState<Mode>(null);
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function prepare() {
      if (loading || !isAuthenticated) {
        if (mounted) setMode(null);
        return;
      }

      if (!(await hasCompletedOnboarding())) {
        if (mounted) setMode("onboarding");
        return;
      }

      if (!(await hasLocalPin())) {
        if (mounted) setMode("create-pin");
      }
    }

    prepare();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, loading]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        hasLocalPin().then((exists) => {
          if (exists) setMode("locked");
        });
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated]);

  const completeOnboarding = async () => {
    await markOnboardingComplete();
    setStep(0);
    setMode((await hasLocalPin()) ? null : "create-pin");
  };

  const createPin = async () => {
    if (!/^\d{4,6}$/.test(pin)) {
      setMessage("El PIN debe tener entre 4 y 6 digitos.");
      return;
    }

    await saveLocalPin(pin);
    setPin("");
    setMessage("");
    setMode(null);
  };

  const unlockWithPin = async () => {
    if (await verifyLocalPin(pin)) {
      setPin("");
      setMessage("");
      setMode(null);
      return;
    }
    setMessage("PIN incorrecto.");
  };

  const unlockWithBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!compatible || !enrolled) {
      setMessage("Biometria no disponible. Usa PIN.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      cancelLabel: "Usar PIN",
      promptMessage: "Desbloquear GeoKipu"
    });

    if (result.success) {
      setMessage("");
      setMode(null);
    }
  };

  if (!mode) return null;

  const current = onboardingSteps[step];
  const isLast = step === onboardingSteps.length - 1;

  return (
    <Modal animationType="fade" transparent visible>
      <View style={styles.overlay}>
        <Card elevated style={styles.modal}>
          {mode === "onboarding" ? (
            <>
              <Text style={styles.kicker}>Paso {step + 1} de {onboardingSteps.length}</Text>
              <Text style={styles.title}>{current.title}</Text>
              <Text muted style={styles.body}>{current.text}</Text>
              <View style={styles.actions}>
                <ActionButton variant="secondary" onPress={completeOnboarding}>Saltar</ActionButton>
                <ActionButton
                  icon={isLast ? ShieldCheck : undefined}
                  onPress={isLast ? completeOnboarding : () => setStep((value) => value + 1)}
                >
                  {isLast ? "Finalizar" : "Siguiente"}
                </ActionButton>
              </View>
            </>
          ) : (
            <>
              <LockKeyhole color={colors.secondary} size={32} />
              <Text style={styles.title}>
                {mode === "create-pin" ? "Crear PIN local" : "GeoKipu bloqueado"}
              </Text>
              <Text muted style={styles.body}>
                {mode === "create-pin"
                  ? "Crea un PIN de 4 a 6 digitos para proteger datos familiares y ubicaciones."
                  : "Valida PIN o biometria para volver a ver informacion sensible."}
              </Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={6}
                placeholder="PIN"
                placeholderTextColor={colors.faint}
                secureTextEntry
                style={styles.input}
                value={pin}
                onChangeText={(value) => setPin(value.replace(/\D/g, ""))}
              />
              {message ? <Text style={styles.error}>{message}</Text> : null}
              <View style={styles.actions}>
                {mode === "locked" ? (
                  <ActionButton variant="secondary" onPress={unlockWithBiometrics}>Biometria</ActionButton>
                ) : null}
                <ActionButton onPress={mode === "create-pin" ? createPin : unlockWithPin}>
                  {mode === "create-pin" ? "Guardar PIN" : "Desbloquear"}
                </ActionButton>
              </View>
            </>
          )}
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(2, 6, 23, 0.82)",
    flex: 1,
    justifyContent: "center",
    padding: 18
  },
  modal: {
    gap: 14,
    maxWidth: 430,
    width: "100%"
  },
  kicker: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 32
  },
  body: {
    fontSize: 15,
    lineHeight: 22
  },
  input: {
    backgroundColor: "rgba(2, 6, 23, 0.42)",
    borderColor: colors.glassBorder,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: colors.text,
    fontSize: 18,
    minHeight: 52,
    paddingHorizontal: 14
  },
  error: {
    color: "#fecaca",
    fontSize: 13,
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});
