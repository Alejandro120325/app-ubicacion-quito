import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/text";
import { colors } from "@/constants/theme";

type DetailRowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <View style={styles.row}>
      <Icon color={colors.muted} size={16} />
      <View style={styles.body}>
        <Text muted style={styles.label}>
          {label}
        </Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.055)",
    borderColor: colors.glassBorder,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    padding: 12
  },
  body: {
    flex: 1,
    gap: 2
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16
  },
  value: {
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 19
  }
});
