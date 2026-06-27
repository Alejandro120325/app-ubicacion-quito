import React from "react";
import { motion } from "framer-motion";
import { Clock3, LocateFixed, MapPin, Navigation, Radio } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const defaultPoints = [
  { label: "La Carolina", top: "27%", left: "62%", locationStatus: "sharing" },
  { label: "Centro Histórico", top: "55%", left: "36%", locationStatus: "sharing" },
  { label: "Cumbayá", top: "45%", left: "76%", locationStatus: "offline" },
  { label: "Quitumbe", top: "72%", left: "58%", locationStatus: "paused" },
  { label: "Universidad", top: "61%", left: "48%", locationStatus: "sharing" }
];

const roadLines = [
  "left-[8%] top-[28%] w-[76%] rotate-[9deg]",
  "left-[14%] top-[64%] w-[68%] -rotate-[12deg]",
  "left-[40%] top-[9%] h-[76%] w-1 rotate-[6deg]",
  "left-[70%] top-[23%] h-[58%] w-1 -rotate-[18deg]",
  "left-[16%] top-[45%] w-[48%] rotate-[27deg]",
  "left-[54%] top-[55%] w-[34%] -rotate-[20deg]"
];

const variantClasses = {
  compact: "min-h-[260px]",
  dashboard: "min-h-[420px]",
  large: "min-h-[560px]",
  fullscreen: "min-h-[calc(100vh-180px)]",
  default: "min-h-[360px]"
};

const getPointStatus = (point) =>
  point.locationStatus || point.status || (point.active ? "sharing" : "paused");

const getMarkerClass = (status) => {
  if (status === "sharing") return "bg-[var(--color-secondary)] text-white";
  if (status === "offline") return "bg-slate-950 text-white ring-1 ring-slate-700";
  return "bg-[var(--color-card)] text-[var(--color-muted)] ring-1 ring-[var(--color-border)]";
};

const normalizeMembers = (members = []) =>
  members.map((member, index) => ({
    label: member.relation || member.fullName,
    fullName: member.fullName,
    locationStatus: member.locationStatus,
    top: member.top || defaultPoints[index % defaultPoints.length].top,
    left: member.left || defaultPoints[index % defaultPoints.length].left
  }));

// Future real-time connection point: feed this component with coordinates from
// the Geolocation API or a WebSocket without requesting browser permissions here.
const SimulatedMap = ({
  className = "",
  compact = false,
  dashboard = false,
  large = false,
  lastUpdate,
  mainLabel = "Quito",
  members = [],
  points = defaultPoints,
  selectedMember,
  selectedLabel,
  showConnections = false,
  showMembers = false,
  variant: variantProp
}) => {
  const { t } = useLanguage();
  const variant =
    variantProp || (compact ? "compact" : large ? "large" : dashboard ? "dashboard" : "default");
  const statusUpdate = lastUpdate || t("map.defaultUpdate");
  const memberPoints = normalizeMembers(members);
  const visiblePoints = showMembers && memberPoints.length ? memberPoints : points;
  const currentSelection =
    selectedMember?.relation || selectedMember?.fullName || selectedLabel;

  return (
    <motion.div
      className={`urban-grid relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm ${variantClasses[variant] || variantClasses.default} ${className}`}
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="absolute inset-4 rounded-lg border border-[var(--color-border)]/70 bg-[var(--color-card)]/10 shadow-inner" />

      <div className="absolute inset-5 opacity-85">
        {roadLines.map((line) => (
          <span className={`map-line ${line}`} key={line} />
        ))}
      </div>

      {showConnections || showMembers ? (
        <div className="pointer-events-none absolute inset-5 opacity-60">
          <span className="map-line left-[32%] top-[40%] w-[34%] rotate-[17deg]" />
          <span className="map-line left-[38%] top-[57%] w-[30%] -rotate-[18deg]" />
          <span className="map-line left-[55%] top-[46%] w-[24%] rotate-[8deg]" />
        </div>
      ) : null}

      <div className="absolute left-7 top-7 rounded-lg bg-slate-950/95 px-3 py-2 text-xs font-bold text-white shadow-soft sm:text-sm">
        {t("map.badge", { place: mainLabel })}
      </div>

      {visiblePoints.map((point, index) => {
        const isSelected = currentSelection ? point.label === currentSelection : index === 0;
        const status = getPointStatus(point);

        return (
          <motion.button
            className="absolute -translate-x-1/2 -translate-y-1/2 text-left focus-ring"
            key={`${point.label}-${index}`}
            style={{ top: point.top, left: point.left }}
            type="button"
            initial={{ opacity: 0, y: 12, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08 * index }}
          >
          <span
            className={`relative flex h-12 w-12 items-center justify-center rounded-lg shadow-soft ${
              isSelected ? "ring-4 ring-[var(--color-ring)]" : ""
            } ${getMarkerClass(status)}`}
          >
            {status === "sharing" ? (
              <motion.span
                className="absolute inset-0 rounded-lg bg-[var(--color-secondary)]"
                  animate={{ scale: [1, 1.55, 1], opacity: [0.28, 0, 0.28] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.18 }}
                />
              ) : null}
              {isSelected ? (
                <LocateFixed className="relative h-5 w-5" aria-hidden="true" />
              ) : (
                <MapPin className="relative h-5 w-5" aria-hidden="true" />
              )}
            </span>
            {!compact ? (
              <span className="mt-2 block max-w-[132px] rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-1 text-xs font-bold leading-tight text-[var(--color-text)] shadow-sm">
                {point.label}
              </span>
            ) : null}
          </motion.button>
        );
      })}

      <div className="absolute bottom-7 left-7 right-7 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]/95 p-4 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
              <Radio className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
              {t("map.title")}
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {t("map.caption")} - {t("map.ready")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["sharing", "paused", "offline"].map((status) => (
              <span
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-soft)] px-2 py-1 text-xs font-semibold text-[var(--color-muted)]"
                key={status}
              >
                <span className={`h-2 w-2 rounded-full ${status === "sharing" ? "bg-[var(--color-secondary)]" : status === "paused" ? "bg-amber-400" : "bg-slate-500"}`} />
                {t(`groups.status.${status}`)}
              </span>
            ))}
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[var(--color-soft)] px-2 py-1 text-xs font-semibold text-[var(--color-muted)]">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {statusUpdate}
            </span>
          </div>
        </div>
      </div>

      <Navigation className="absolute right-7 top-7 h-5 w-5 text-[var(--color-primary)]" />
    </motion.div>
  );
};

export default SimulatedMap;
