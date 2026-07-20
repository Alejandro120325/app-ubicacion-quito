import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { colors, radii } from "@/constants/theme";
import { Text } from "@/components/text";

type Variant = "primary" | "secondary" | "success" | "dark" | "warning" | "danger";

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
    backgroundColor: "rgba(29, 78, 216, 0.88)",
    borderColor: "rgba(147, 197, 253, 0.32)",
    color: colors.white
  },
  secondary: {
    backgroundColor: "rgba(255, 255, 255, 0.075)",
    borderColor: colors.glassBorder,
    color: colors.text
  },
  success: {
    backgroundColor: "rgba(20, 184, 166, 0.9)",
    borderColor: "rgba(153, 246, 228, 0.34)",
    color: colors.background
  },
  dark: {
    backgroundColor: "rgba(2, 6, 23, 0.54)",
    borderColor: colors.glassBorder,
    color: colors.text
  },
  warning: {
    backgroundColor: "rgba(245, 158, 11, 0.92)",
    borderColor: "rgba(253, 230, 138, 0.36)",
    color: colors.background
  },
  danger: {
    backgroundColor: "rgba(244, 63, 94, 0.9)",
    borderColor: "rgba(251, 113, 133, 0.36)",
    color: colors.white
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
    boxShadow: "0 10px 26px rgba(0, 0, 0, 0.22)",
    borderCurve: "continuous",
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
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
