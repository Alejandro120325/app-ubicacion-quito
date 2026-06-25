import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";

type StatCardProps = {
  detail: string;
  icon: LucideIcon;
  label: string;
  tone?: "blue" | "green" | "amber" | "slate";
  value: string | number;
};

const tones = {
  blue: colors.primary,
  green: colors.secondary,
  amber: colors.alert,
  slate: colors.muted
};

export function StatCard({ detail, icon: Icon, label, tone = "blue", value }: StatCardProps) {
  const color = tones[tone];

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.iconFrame, { backgroundColor: `${color}22` }]}>
          <Icon color={color} size={19} />
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text muted style={styles.detail}>
        {detail}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 148
  },
  top: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconFrame: {
    alignItems: "center",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  value: {
    fontSize: 28,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 34
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 12
  },
  detail: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
  }
});
