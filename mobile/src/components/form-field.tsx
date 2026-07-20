import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps
} from "react-native";

import { colors, radii } from "@/constants/theme";
import { Text } from "@/components/text";

type FormFieldProps = TextInputProps & {
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  password?: boolean;
};

export function FormField({
  error,
  helperText,
  icon: Icon,
  label,
  password = false,
  secureTextEntry,
  style,
  ...props
}: FormFieldProps) {
  const [visible, setVisible] = useState(false);
  const isSecure = password ? !visible : secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputFrame, error ? styles.inputError : null]}>
        {Icon ? <Icon color={colors.muted} size={18} /> : null}
        <TextInput
          placeholderTextColor={colors.faint}
          secureTextEntry={isSecure}
          style={[styles.input, style]}
          {...props}
        />
        {password ? (
          <Pressable
            accessibilityLabel={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            accessibilityRole="button"
            onPress={() => setVisible((current) => !current)}
            style={styles.eyeButton}
          >
            {visible ? (
              <EyeOff color={colors.muted} size={18} />
            ) : (
              <Eye color={colors.muted} size={18} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helperText ? (
        <Text muted style={styles.helper}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: "800"
  },
  inputFrame: {
    alignItems: "center",
    backgroundColor: "rgba(2, 6, 23, 0.42)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderCurve: "continuous",
    borderRadius: radii.sm,
    borderWidth: 1,
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.055)",
    flexDirection: "row",
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 12
  },
  inputError: {
    borderColor: colors.danger
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    minHeight: 48,
    paddingVertical: 0
  },
  eyeButton: {
    padding: 6
  },
  error: {
    color: "#fca5a5",
    fontSize: 13,
    fontWeight: "700"
  },
  helper: {
    fontSize: 13
  }
});
