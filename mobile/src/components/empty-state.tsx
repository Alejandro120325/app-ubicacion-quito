import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";

type EmptyStateProps = {
  body: string;
  icon: LucideIcon;
  title: string;
};

export function EmptyState({ body, icon: Icon, title }: EmptyStateProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.icon}>
        <Icon color={colors.secondary} size={22} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text muted style={styles.body}>
        {body}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "flex-start",
    gap: 10
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(20, 184, 166, 0.16)",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  title: {
    fontSize: 17,
    fontWeight: "900"
  },
  body: {
    fontSize: 13,
    lineHeight: 19
  }
});
