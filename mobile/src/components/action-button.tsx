import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { colors, radii } from "@/constants/theme";
import { Text } from "@/components/text";

type Variant = "primary" | "secondary" | "success" | "dark" | "warning";

type ActionButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  icon?: LucideIcon;
  loading?: boolean;
  onPress?: () => void;
  variant?: Variant;
};

const variantStyles: Record<Variant, { backgroundColor: string; borderColor: string; color: string }> = {
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.white
  },
  secondary: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.borderStrong,
    color: colors.text
  },
  success: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    color: colors.background
  },
  dark: {
    backgroundColor: "#050b18",
    borderColor: colors.borderStrong,
    color: colors.text
  },
  warning: {
    backgroundColor: colors.alert,
    borderColor: colors.alert,
    color: colors.background
  }
};

export function ActionButton({
  children,
  disabled = false,
  icon: Icon,
  loading = false,
  onPress,
  variant = "primary"
}: ActionButtonProps) {
  const palette = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.backgroundColor, borderColor: palette.borderColor },
        pressed ? styles.pressed : null,
        disabled || loading ? styles.disabled : null
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.color} size="small" />
      ) : Icon ? (
        <Icon color={palette.color} size={18} strokeWidth={2.4} />
      ) : null}
      <Text selectable={false} style={[styles.label, { color: palette.color }]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    opacity: 0.55
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
    textAlign: "center"
  }
});
