import { Mail, MapPin, Phone } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { Pill } from "@/components/pill";
import { Text } from "@/components/text";
import { colors, radii } from "@/constants/theme";
import type { User } from "@/types";

type PersonCardProps = {
  person: User;
  onPress?: (person: User) => void;
};

export function PersonCard({ person, onPress }: PersonCardProps) {
  const location = person.lastLocation;
  const isGpsReal = location?.simulated === false;
  const locationText = location?.address || location?.sector || "Sin ubicacion";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(person)}
      style={({ pressed }) => [pressed ? styles.pressed : null]}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text selectable={false} style={styles.avatarText}>
              {person.fullName.slice(0, 1)}
            </Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{person.fullName}</Text>
            <Pill tone={person.active ? "green" : "muted"}>
              {person.active ? "Activo" : "Inactivo"}
            </Pill>
          </View>
        </View>
        <View style={styles.meta}>
          <Info icon={Mail} value={person.email} />
          <Info icon={Phone} value={person.phone} />
          <Info
            icon={MapPin}
            value={locationText}
          />
          {isGpsReal ? (
            <Pill tone="green">
              GPS real{location?.accuracy != null ? ` - ${Math.round(location.accuracy)} m` : ""}
            </Pill>
          ) : null}
        </View>
        <View style={styles.footer}>
          <Text style={styles.action}>Ver detalles</Text>
        </View>
      </Card>
    </Pressable>
  );
}

function Info({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Icon color={colors.muted} size={15} />
      <Text muted style={styles.infoText}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
  },
  card: {
    gap: 14
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderCurve: "continuous",
    borderRadius: radii.sm,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900"
  },
  titleBlock: {
    flex: 1,
    gap: 7
  },
  name: {
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22
  },
  meta: {
    gap: 8
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18
  },
  footer: {
    borderColor: colors.glassBorder,
    borderTopWidth: 1,
    paddingTop: 12
  },
  action: {
    color: "#93c5fd",
    fontSize: 13,
    fontWeight: "900"
  }
});
