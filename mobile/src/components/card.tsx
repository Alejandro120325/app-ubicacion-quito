import { LinearGradient } from "expo-linear-gradient";
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
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.105)",
          "rgba(255, 255, 255, 0.028)",
          "rgba(20, 184, 166, 0.045)"
        ]}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        style={styles.glassLayer}
      />
      <View pointerEvents="none" style={styles.innerStroke} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderCurve: "continuous",
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    padding: 16
  },
  soft: {
    backgroundColor: colors.glassSoft
  },
  elevated: {
    ...shadows.glass,
    backgroundColor: colors.glassStrong,
    borderColor: "rgba(255, 255, 255, 0.16)"
  },
  glassLayer: {
    bottom: 0,
    left: 0,
    opacity: 0.82,
    position: "absolute",
    right: 0,
    top: 0
  },
  innerStroke: {
    borderColor: "rgba(255, 255, 255, 0.07)",
    borderCurve: "continuous",
    borderRadius: radii.md,
    borderWidth: 1,
    bottom: 1,
    left: 1,
    position: "absolute",
    right: 1,
    top: 1
  }
});
