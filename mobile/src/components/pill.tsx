import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { colors, radii } from "@/constants/theme";
import { Text } from "@/components/text";

type PillProps = {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: "blue" | "green" | "amber" | "muted";
};

const tones = {
  blue: { backgroundColor: "rgba(29, 78, 216, 0.16)", color: "#bfdbfe" },
  green: { backgroundColor: "rgba(20, 184, 166, 0.18)", color: "#99f6e4" },
  amber: { backgroundColor: "rgba(245, 158, 11, 0.18)", color: "#fde68a" },
  muted: { backgroundColor: colors.cardSoft, color: colors.muted }
};

export function Pill({ children, icon: Icon, tone = "muted" }: PillProps) {
  const palette = tones[tone];

  return (
    <View style={[styles.pill, { backgroundColor: palette.backgroundColor }]}>
      {Icon ? <Icon color={palette.color} size={15} /> : null}
      <Text selectable={false} style={[styles.text, { color: palette.color }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderCurve: "continuous",
    borderRadius: radii.sm,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  text: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16
  }
});
