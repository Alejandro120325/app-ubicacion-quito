import React from "react";
import { motion } from "framer-motion";
import { Clock3, LocateFixed, MapPin, Navigation, Radio } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const defaultPoints = [
  { label: "La Carolina", top: "27%", left: "62%", active: true },
  { label: "Centro Histórico", top: "55%", left: "36%", active: true },
  { label: "Cumbayá", top: "45%", left: "76%", active: false },
  { label: "Quitumbe", top: "72%", left: "58%", active: false },
  { label: "Universidad", top: "61%", left: "48%", active: true }
];

const roadLines = [
  "left-[10%] top-[30%] w-[70%] rotate-[10deg]",
  "left-[16%] top-[62%] w-[66%] -rotate-[13deg]",
  "left-[42%] top-[8%] h-[76%] w-1 rotate-[6deg]",
  "left-[68%] top-[22%] h-[58%] w-1 -rotate-[18deg]",
  "left-[18%] top-[45%] w-[44%] rotate-[28deg]"
];

const variantClasses = {
  compact: "min-h-[280px]",
  large: "min-h-[430px]",
  dashboard: "min-h-[360px]",
  default: "min-h-[340px]"
};

// Future real-time connection point: feed this component with coordinates from
// the Geolocation API or a WebSocket without requesting browser permissions here.
const SimulatedMap = ({
  className = "",
  compact = false,
  dashboard = false,
  large = false,
  lastUpdate,
  mainLabel = "Quito",
  points = defaultPoints,
  selectedLabel
}) => {
  const { t } = useLanguage();
  const variant = compact ? "compact" : large ? "large" : dashboard ? "dashboard" : "default";
  const statusUpdate = lastUpdate || t("map.defaultUpdate");

  return (
    <motion.div
      className={`urban-grid relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] ${variantClasses[variant]} ${className}`}
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="absolute inset-0 opacity-80">
        {roadLines.map((line) => (
          <span className={`map-line ${line}`} key={line} />
        ))}
      </div>

      <div className="absolute left-4 top-4 rounded-lg bg-slate-950/95 px-3 py-2 text-xs font-bold text-white shadow-soft sm:text-sm">
        {t("map.badge", { place: mainLabel })}
      </div>

      {points.map((point, index) => {
        const isSelected = selectedLabel ? point.label === selectedLabel : index === 0;

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
              className={`relative flex h-11 w-11 items-center justify-center rounded-lg shadow-soft ${
                point.active
                  ? "bg-[var(--color-secondary)] text-white"
                  : "bg-[var(--color-card)] text-[var(--color-muted)] ring-1 ring-[var(--color-border)]"
              }`}
            >
              {point.active ? (
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
              <span className="mt-2 block max-w-[120px] rounded-lg bg-[var(--color-card)] px-2 py-1 text-xs font-bold leading-tight text-[var(--color-text)] shadow-sm">
                {point.label}
              </span>
            ) : null}
          </motion.button>
        );
      })}

      <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
              <Radio className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
              {t("map.title")}
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {t("map.caption")} - {t("map.ready")}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[var(--color-soft)] px-2 py-1 text-xs font-semibold text-[var(--color-muted)]">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {statusUpdate}
          </span>
        </div>
      </div>

      <Navigation className="absolute right-4 top-4 h-5 w-5 text-[var(--color-primary)]" />
    </motion.div>
  );
};

export default SimulatedMap;
