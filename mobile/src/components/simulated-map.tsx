import { Clock3, LocateFixed, MapPin, Navigation, Radio } from "lucide-react-native";
import {
  StyleSheet,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle
} from "react-native";

import { Card } from "@/components/card";
import { Text } from "@/components/text";
import { colors, radii } from "@/constants/theme";
import { mapMarkers } from "@/data/mock-data";
import type { MapPoint } from "@/types";

type SimulatedMapProps = {
  height?: number;
  lastUpdate?: string;
  points?: MapPoint[];
  selectedLabel?: string;
  showConnections?: boolean;
  style?: StyleProp<ViewStyle>;
};

const roads = [
  { left: "8%", top: "30%", width: "74%", rotate: "10deg" },
  { left: "16%", top: "62%", width: "66%", rotate: "-13deg" },
  { left: "40%", top: "10%", height: "72%", rotate: "6deg" },
  { left: "68%", top: "22%", height: "56%", rotate: "-18deg" },
  { left: "18%", top: "46%", width: "44%", rotate: "28deg" }
];

const dimension = (value: number | string) => value as DimensionValue;

function markerColor(point: MapPoint) {
  const status = point.locationStatus || (point.active ? "sharing" : "paused");
  if (status === "sharing") return colors.secondary;
  if (status === "offline") return "#020617";
  return colors.cardElevated;
}

export function SimulatedMap({
  height = 330,
  lastUpdate = "Actualizado hace unos segundos",
  points = mapMarkers,
  selectedLabel,
  showConnections = false,
  style
}: SimulatedMapProps) {
  return (
    <View style={[styles.map, { minHeight: height }, style]}>
      <View pointerEvents="none" style={styles.mapGrid}>
        {Array.from({ length: 8 }).map((_, index) => (
          <View key={`mv-${index}`} style={[styles.vLine, { left: `${index * 14}%` }]} />
        ))}
        {Array.from({ length: 8 }).map((_, index) => (
          <View key={`mh-${index}`} style={[styles.hLine, { top: `${index * 14}%` }]} />
        ))}
      </View>

      {roads.map((road, index) => (
        <View
          key={`road-${index}`}
          style={[
            styles.road,
            {
              height: dimension(road.height ? road.height : 3),
              left: dimension(road.left),
              top: dimension(road.top),
              transform: [{ rotate: road.rotate }],
              width: dimension(road.width ? road.width : 3)
            }
          ]}
        />
      ))}

      {showConnections ? (
        <View pointerEvents="none" style={styles.connections}>
          <View style={[styles.road, styles.connectionA]} />
          <View style={[styles.road, styles.connectionB]} />
          <View style={[styles.road, styles.connectionC]} />
        </View>
      ) : null}

      <View style={styles.badge}>
        <Text selectable={false} style={styles.badgeText}>
          Mapa simulado Quito
        </Text>
      </View>
      <Navigation color={colors.primary} size={22} style={styles.navIcon} />

      {points.map((point, index) => {
        const active = selectedLabel ? point.label === selectedLabel : index === 0;
        const color = markerColor(point);

        return (
          <View
            key={`${point.label}-${index}`}
            style={[
              styles.markerWrap,
              { left: dimension(point.left), top: dimension(point.top) }
            ]}
          >
            <View style={[styles.marker, { backgroundColor: color }]}>
              {active ? (
                <LocateFixed color={colors.white} size={18} />
              ) : (
                <MapPin color={colors.white} size={18} />
              )}
            </View>
            <Text selectable={false} style={styles.markerLabel}>
              {point.label}
            </Text>
          </View>
        );
      })}

      <Card style={styles.status}>
        <View style={styles.statusTop}>
          <View style={styles.statusTitle}>
            <Radio color={colors.secondary} size={16} />
            <Text style={styles.statusHeading}>Ubicacion simulada</Text>
          </View>
          <View style={styles.time}>
            <Clock3 color={colors.muted} size={13} />
            <Text muted style={styles.timeText}>
              {lastUpdate}
            </Text>
          </View>
        </View>
        <Text muted style={styles.statusCaption}>
          Seguimiento activo con marcadores visuales de referencia.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.border,
    borderCurve: "continuous",
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative"
  },
  mapGrid: {
    bottom: 0,
    left: 0,
    opacity: 0.34,
    position: "absolute",
    right: 0,
    top: 0
  },
  vLine: {
    backgroundColor: "rgba(20, 184, 166, 0.42)",
    bottom: 0,
    position: "absolute",
    top: 0,
    width: StyleSheet.hairlineWidth
  },
  hLine: {
    backgroundColor: "rgba(29, 78, 216, 0.42)",
    height: StyleSheet.hairlineWidth,
    left: 0,
    position: "absolute",
    right: 0
  },
  road: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    opacity: 0.65,
    position: "absolute"
  },
  connections: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  connectionA: {
    left: "32%",
    top: "40%",
    transform: [{ rotate: "17deg" }],
    width: "34%"
  },
  connectionB: {
    left: "38%",
    top: "57%",
    transform: [{ rotate: "-18deg" }],
    width: "30%"
  },
  connectionC: {
    left: "55%",
    top: "46%",
    transform: [{ rotate: "8deg" }],
    width: "24%"
  },
  badge: {
    backgroundColor: "rgba(2, 6, 23, 0.9)",
    borderRadius: 8,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: "absolute",
    top: 14
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15
  },
  navIcon: {
    position: "absolute",
    right: 16,
    top: 16
  },
  markerWrap: {
    alignItems: "center",
    maxWidth: 104,
    position: "absolute",
    transform: [{ translateX: -22 }, { translateY: -22 }]
  },
  marker: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.18)",
    borderCurve: "continuous",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  markerLabel: {
    backgroundColor: "rgba(15, 23, 42, 0.94)",
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 14,
    marginTop: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    textAlign: "center"
  },
  status: {
    bottom: 14,
    left: 14,
    padding: 12,
    position: "absolute",
    right: 14
  },
  statusTop: {
    gap: 10
  },
  statusTitle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7
  },
  statusHeading: {
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17
  },
  time: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5
  },
  timeText: {
    fontSize: 11,
    lineHeight: 14
  },
  statusCaption: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6
  }
});
