import { Edit3, LocateFixed, PauseCircle, Trash2, WifiOff } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { Pill } from "@/components/pill";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import type { GroupMember, LocationStatus } from "@/types";

type MemberCardProps = {
  member: GroupMember;
  onDelete?: (member: GroupMember) => void;
  onEdit?: (member: GroupMember) => void;
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

export function MemberCard({ member, onDelete, onEdit, onPress }: MemberCardProps) {
  const status = statusMeta[member.locationStatus];
  const isGpsReal = member.simulated === false;
  const locationText = member.address || member.lastLocation;

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
            {locationText}
          </Text>
          {isGpsReal ? (
            <Text style={styles.gpsText}>
              GPS real{member.accuracy != null ? ` - ${Math.round(member.accuracy)} m` : ""}
            </Text>
          ) : null}
          <Text muted style={styles.metaText}>
            {member.lastUpdate}
          </Text>
        </View>
        <Text style={styles.action}>Ver ubicacion</Text>
        {onEdit || onDelete ? (
          <View style={styles.actions}>
            {onEdit ? (
              <ActionButton icon={Edit3} variant="secondary" onPress={() => onEdit(member)}>
                Editar
              </ActionButton>
            ) : null}
            {onDelete ? (
              <ActionButton icon={Trash2} variant="danger" onPress={() => onDelete(member)}>
                Eliminar integrante
              </ActionButton>
            ) : null}
          </View>
        ) : null}
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
  gpsText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  action: {
    color: "#93c5fd",
    fontSize: 13,
    fontWeight: "900"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
