import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radii, shadows } from "@/constants/theme";

type CardProps = {
  children: ReactNode;
  elevated?: boolean;
  soft?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, elevated = false, soft = false, style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        soft ? styles.soft : null,
        elevated ? styles.elevated : null,
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderCurve: "continuous",
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 16
  },
  soft: {
    backgroundColor: "rgba(15, 23, 42, 0.78)"
  },
  elevated: {
    ...shadows.soft,
    backgroundColor: colors.cardElevated
  }
});
