import { LocateFixed, PauseCircle, WifiOff } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { Pill } from "@/components/pill";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import type { GroupMember, LocationStatus } from "@/types";

type MemberCardProps = {
  member: GroupMember;
  onPress?: (member: GroupMember) => void;
};

const statusMeta: Record<LocationStatus, { label: string; tone: "green" | "amber" | "muted" }> = {
  sharing: { label: "Compartiendo", tone: "green" },
  paused: { label: "Pausado", tone: "amber" },
  offline: { label: "Sin conexion", tone: "muted" }
};

function StatusIcon({ status }: { status: LocationStatus }) {
  if (status === "sharing") return <LocateFixed color={colors.secondary} size={19} />;
  if (status === "paused") return <PauseCircle color={colors.alert} size={19} />;
  return <WifiOff color={colors.muted} size={19} />;
}

export function MemberCard({ member, onPress }: MemberCardProps) {
  const status = statusMeta[member.locationStatus];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(member)}
      style={({ pressed }) => [pressed ? styles.pressed : null]}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <StatusIcon status={member.locationStatus} />
          <View style={styles.main}>
            <Text style={styles.name}>{member.fullName}</Text>
            <Text muted style={styles.relation}>
              {member.relation}
            </Text>
          </View>
          <Pill tone={status.tone}>{status.label}</Pill>
        </View>
        <View style={styles.meta}>
          <Text muted style={styles.metaText}>
            {member.lastLocation}
          </Text>
          <Text muted style={styles.metaText}>
            {member.lastUpdate}
          </Text>
        </View>
        <Text style={styles.action}>Ver ubicacion</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
  },
  card: {
    gap: 12
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10
  },
  main: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: "900"
  },
  relation: {
    fontSize: 12,
    marginTop: 2
  },
  meta: {
    backgroundColor: "rgba(255, 255, 255, 0.055)",
    borderColor: colors.glassBorder,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 10
  },
  metaText: {
    fontSize: 12,
    lineHeight: 17
  },
  action: {
    color: "#93c5fd",
    fontSize: 13,
    fontWeight: "900"
  }
});
