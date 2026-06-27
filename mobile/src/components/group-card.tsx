import { Plus, UsersRound } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import type { Group } from "@/types";

type GroupCardProps = {
  active?: boolean;
  group: Group;
  onAddMember?: (group: Group) => void;
  onPress?: (group: Group) => void;
};

export function GroupCard({ active = false, group, onAddMember, onPress }: GroupCardProps) {
  return (
    <Card style={[styles.card, active ? styles.active : null]}>
      <Pressable accessibilityRole="button" onPress={() => onPress?.(group)} style={styles.press}>
        <View style={styles.icon}>
          <UsersRound color={colors.secondary} size={20} />
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{group.name}</Text>
          <Text muted style={styles.description}>
            {group.description || "Grupo de contactos seguros"}
          </Text>
          <Text muted style={styles.count}>
            {group.members.length} integrantes
          </Text>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <ActionButton onPress={() => onPress?.(group)} variant="secondary">
          Ver detalles
        </ActionButton>
        <ActionButton icon={Plus} onPress={() => onAddMember?.(group)} variant="dark">
          Agregar
        </ActionButton>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14
  },
  active: {
    borderColor: colors.secondary
  },
  press: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(20, 184, 166, 0.18)",
    borderColor: "rgba(153, 246, 228, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  body: {
    flex: 1,
    gap: 4
  },
  name: {
    fontSize: 18,
    fontWeight: "900"
  },
  description: {
    fontSize: 13,
    lineHeight: 18
  },
  count: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2
  },
  actions: {
    flexDirection: "row",
    gap: 10
  }
});
