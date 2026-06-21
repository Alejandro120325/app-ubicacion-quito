import React from "react";
import { motion } from "framer-motion";
import { Clock3, LocateFixed, MapPin, Navigation, Radio } from "lucide-react";

const defaultPoints = [
  {
    label: "La Carolina",
    top: "23%",
    left: "58%",
    active: true
  },
  {
    label: "Centro Historico",
    top: "48%",
    left: "42%",
    active: true
  },
  {
    label: "Cumbaya",
    top: "36%",
    left: "76%",
    active: false
  },
  {
    label: "Quitumbe",
    top: "73%",
    left: "34%",
    active: false
  },
  {
    label: "Universidad",
    top: "57%",
    left: "60%",
    active: true
  }
];

const roadLines = [
  "left-[8%] top-[25%] w-[72%] rotate-[10deg]",
  "left-[18%] top-[62%] w-[66%] -rotate-[13deg]",
  "left-[42%] top-[8%] h-[78%] w-1 rotate-[6deg]",
  "left-[68%] top-[18%] h-[60%] w-1 -rotate-[20deg]",
  "left-[12%] top-[44%] w-[46%] rotate-[28deg]"
];

const SimulatedMap = ({
  className = "",
  compact = false,
  lastUpdate = "2026-06-21 15:30",
  mainLabel = "Quito",
  points = defaultPoints,
  selectedLabel
}) => (
  <motion.div
    className={`urban-grid relative overflow-hidden rounded-lg border border-slate-200 bg-white ${className}`}
    initial={false}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35 }}
  >
    <div className="absolute inset-0 opacity-80">
      {roadLines.map((line) => (
        <span className={`map-line ${line}`} key={line} />
      ))}
    </div>

    <div className="absolute left-4 top-4 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white shadow-soft sm:text-sm">
      {mainLabel} · mapa simulado
    </div>

    {points.map((point, index) => {
      const isSelected = selectedLabel ? point.label === selectedLabel : index === 0;

      return (
        <motion.button
          className="absolute -translate-x-1/2 -translate-y-1/2 text-left focus-ring"
          key={point.label}
          style={{ top: point.top, left: point.left }}
          type="button"
          initial={{ opacity: 0, y: 12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.08 * index }}
        >
          <span
            className={`relative flex h-11 w-11 items-center justify-center rounded-lg shadow-soft ${
              point.active
                ? "bg-quito-mint text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {point.active ? (
              <motion.span
                className="absolute inset-0 rounded-lg bg-teal-400/40"
                animate={{ scale: [1, 1.55, 1], opacity: [0.45, 0, 0.45] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.2 }}
              />
            ) : null}
            {isSelected ? (
              <LocateFixed className="relative h-5 w-5" aria-hidden="true" />
            ) : (
              <MapPin className="relative h-5 w-5" aria-hidden="true" />
            )}
          </span>
          {!compact ? (
            <span className="mt-2 block whitespace-nowrap rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-sm">
              {point.label}
            </span>
          ) : null}
        </motion.button>
      );
    })}

    <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/70 bg-white/95 p-3 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
            <Radio className="h-4 w-4 text-quito-mint" aria-hidden="true" />
            Ubicacion simulada
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Datos visuales para la primera entrega, sin API de mapas.
          </p>
        </div>
        <span className="hidden items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {lastUpdate}
        </span>
      </div>
    </div>

    <Navigation className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
  </motion.div>
);

export default SimulatedMap;
