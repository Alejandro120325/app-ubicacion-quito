import React from "react";
import { motion } from "framer-motion";
import { LocateFixed, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { mapMarkerPulse } from "../utils/animations.js";
import MapStatusBar from "./MapStatusBar.jsx";

const defaultPoints = [
  { label: "La Carolina", top: "25%", left: "65%", locationStatus: "sharing" },
  { label: "Centro Historico", top: "67%", left: "28%", locationStatus: "sharing" },
  { label: "Cumbaya", top: "44%", left: "82%", locationStatus: "offline" },
  { label: "Quitumbe", top: "79%", left: "64%", locationStatus: "paused" },
  { label: "Universidad", top: "56%", left: "49%", locationStatus: "sharing" }
];

const roadLines = [
  "left-[7%] top-[23%] w-[78%] rotate-[8deg]",
  "left-[11%] top-[69%] w-[73%] -rotate-[13deg]",
  "left-[37%] top-[7%] h-[80%] w-1 rotate-[5deg]",
  "left-[72%] top-[19%] h-[64%] w-1 -rotate-[17deg]",
  "left-[12%] top-[46%] w-[53%] rotate-[25deg]",
  "left-[53%] top-[57%] w-[37%] -rotate-[20deg]"
];

const secondaryRoads = [
  "left-[18%] top-[17%] h-[66%] w-px -rotate-[8deg]",
  "left-[56%] top-[13%] h-[73%] w-px rotate-[12deg]",
  "left-[9%] top-[38%] w-[82%] h-px -rotate-[4deg]",
  "left-[17%] top-[79%] w-[66%] h-px rotate-[5deg]"
];

const variantClasses = {
  home: "h-[480px] max-sm:h-[420px]",
  login: "h-[420px]",
  dashboard: "h-[460px]",
  group: "h-[540px] max-sm:h-[460px]",
  large: "h-[600px] max-sm:h-[480px]",
  fullscreen: "h-[70vh] min-h-[520px]",
  compact: "h-[280px]",
  default: "h-[420px]"
};

const clamp = (value, min = 10, max = 90) => Math.min(max, Math.max(min, value));

const coordinatesToPosition = (latitude, longitude) => {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const top = clamp(((-0.05 - lat) / 0.33) * 100, 12, 86);
  const left = clamp(((lon - -78.6) / 0.25) * 100, 12, 88);
  return { top: `${top}%`, left: `${left}%` };
};

const getPointStatus = (point) =>
  point.locationStatus || (point.sharing ? "sharing" : point.active ? "sharing" : "paused");

const getMarkerClass = (status) => {
  if (status === "sharing") return "bg-[var(--color-secondary)] text-white";
  if (status === "offline") return "bg-slate-950 text-white ring-1 ring-slate-700";
  return "bg-[var(--color-card)] text-[var(--color-muted)] ring-1 ring-[var(--color-border)]";
};

const normalizePoint = (point, index) => {
  const position = coordinatesToPosition(point.latitude, point.longitude);
  return {
    ...point,
    label: point.label || point.fullName || point.relation || point.sector || `Punto ${index + 1}`,
    locationStatus: getPointStatus(point),
    top: position?.top || point.top || defaultPoints[index % defaultPoints.length].top,
    left: position?.left || point.left || defaultPoints[index % defaultPoints.length].left
  };
};

const SimulatedMap = ({
  className = "",
  compact = false,
  currentUserLocation,
  dashboard = false,
  groupMembers = [],
  large = false,
  lastUpdate,
  locations = [],
  mainLabel = "Quito",
  members = [],
  mode = "simulated",
  points = defaultPoints,
  polling = false,
  selectedGroup,
  selectedMember,
  selectedLabel,
  showMembers = false,
  variant: variantProp
}) => {
  const { t } = useLanguage();
  const variant =
    variantProp || (compact ? "compact" : large ? "large" : dashboard ? "dashboard" : "default");
  const source = locations.length
    ? locations
    : currentUserLocation
      ? [currentUserLocation]
      : showMembers && (groupMembers.length || members.length)
        ? groupMembers.length
          ? groupMembers
          : members
        : points;
  const visiblePoints = source.map(normalizePoint);
  const live =
    mode === "live" ||
    Boolean(currentUserLocation) ||
    locations.some((location) => location.simulated === false);
  const currentSelection =
    selectedMember?.userId || selectedMember?.relation || selectedMember?.fullName || selectedLabel;
  const latestLocationUpdate =
    lastUpdate ||
    locations
      .map((location) => location.updatedAt || location.lastUpdate)
      .filter(Boolean)
      .sort()
      .at(-1);

  return (
    <motion.figure
      className={`m-0 min-w-0 ${className}`}
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      aria-label={t("map.badge", { place: selectedGroup?.name || mainLabel })}
    >
      <div className={`urban-grid map-surface relative overflow-hidden rounded-lg border border-[var(--color-border)] ${variantClasses[variant] || variantClasses.default}`}>
        <div className="map-blocks absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-5 opacity-80" aria-hidden="true">
          {roadLines.map((line) => <span className={`map-line ${line}`} key={line} />)}
          {secondaryRoads.map((line) => <span className={`map-secondary-line ${line}`} key={line} />)}
        </div>

        <div className="absolute left-4 top-4 z-20 rounded-lg bg-slate-950/90 px-3 py-2 text-xs font-bold text-white shadow-soft sm:left-6 sm:top-6 sm:text-sm">
          {t("map.badge", { place: selectedGroup?.name || mainLabel })}
        </div>

        {visiblePoints.map((point, index) => {
          const isSelected = currentSelection
            ? [point.userId, point.label, point.relation, point.fullName].includes(currentSelection)
            : index === 0;
          const status = getPointStatus(point);
          const labelAbove = Number.parseFloat(point.top) > 67;

          return (
            <motion.button
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left focus-ring"
              key={`${point.userId || point.label}-${index}`}
              style={{ top: point.top, left: point.left }}
              type="button"
              initial={{ opacity: 0, y: 10, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.06 * index }}
              title={`${point.fullName || point.label}: ${t(`groups.status.${status}`)} - ${point.updatedAt || point.lastUpdate || t("map.defaultUpdate")}`}
            >
              <span className={`relative flex h-11 w-11 items-center justify-center rounded-lg shadow-soft sm:h-12 sm:w-12 ${isSelected ? "ring-4 ring-[var(--color-ring)]" : ""} ${getMarkerClass(status)}`}>
                {status === "sharing" ? (
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-[var(--color-secondary)]"
                    animate={mapMarkerPulse}
                    transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.16 }}
                  />
                ) : null}
                {isSelected ? <LocateFixed className="relative h-5 w-5" /> : <MapPin className="relative h-5 w-5" />}
              </span>
              {variant !== "compact" ? (
                <span className={`${labelAbove ? "absolute bottom-[54px]" : "mt-2"} left-1/2 flex max-w-[150px] -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md border border-[var(--color-border)] bg-[var(--color-card)]/95 px-2 py-1 text-xs font-bold text-[var(--color-text)] shadow-sm backdrop-blur`}>
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${status === "sharing" ? "bg-[var(--color-secondary)]" : status === "paused" ? "bg-amber-400" : "bg-slate-500"}`} />
                  <span className="truncate">{point.fullName || point.label}</span>
                </span>
              ) : null}
            </motion.button>
          );
        })}

        <Navigation className="absolute right-5 top-5 h-5 w-5 text-[var(--color-primary)] sm:right-7 sm:top-7" aria-hidden="true" />
      </div>
      <MapStatusBar lastUpdate={latestLocationUpdate} live={live} polling={polling} />
    </motion.figure>
  );
};

export default SimulatedMap;
