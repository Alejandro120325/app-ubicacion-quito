import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";

type GradientScreenProps = {
  children: ReactNode;
  padded?: boolean;
};

export function GradientScreen({ children, padded = true }: GradientScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.background, "#062638", "#06382f"]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.root}
    >
      <View pointerEvents="none" style={styles.grid}>
        {Array.from({ length: 10 }).map((_, index) => (
          <View
            key={`v-${index}`}
            style={[styles.gridLineVertical, { left: `${index * 11}%` }]}
          />
        ))}
        {Array.from({ length: 14 }).map((_, index) => (
          <View
            key={`h-${index}`}
            style={[styles.gridLineHorizontal, { top: `${index * 8}%` }]}
          />
        ))}
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          padded ? styles.padded : null,
          { paddingTop: Math.max(insets.top, 18), paddingBottom: Math.max(insets.bottom + 92, 116) }
        ]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  content: {
    gap: 18,
    minHeight: "100%"
  },
  padded: {
    paddingHorizontal: 18
  },
  grid: {
    bottom: 0,
    left: 0,
    opacity: 0.22,
    position: "absolute",
    right: 0,
    top: 0
  },
  gridLineVertical: {
    backgroundColor: "rgba(20, 184, 166, 0.35)",
    bottom: 0,
    position: "absolute",
    top: 0,
    width: StyleSheet.hairlineWidth
  },
  gridLineHorizontal: {
    backgroundColor: "rgba(29, 78, 216, 0.35)",
    height: StyleSheet.hairlineWidth,
    left: 0,
    position: "absolute",
    right: 0
  }
});
