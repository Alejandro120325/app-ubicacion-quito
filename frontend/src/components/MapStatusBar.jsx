import React from "react";
import { Clock3, Database, Radio } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const MapStatusBar = ({ lastUpdate, live = false, polling = false }) => {
  const { t } = useLanguage();

  return (
    <div className="map-status-bar glass-card mt-3 flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
          <Radio className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
          {live ? t("map.liveTitle") : t("map.title")}
        </p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          {live ? t("map.liveReady") : t("map.ready")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
        <span className="status-chip">
          <Database className="h-3.5 w-3.5" aria-hidden="true" />
          {live ? t("map.realData") : t("map.simulatedData")}
        </span>
        {polling ? <span className="status-chip">{t("map.polling")}</span> : null}
        <span className="status-chip min-w-0">
          <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{lastUpdate || t("map.defaultUpdate")}</span>
        </span>
      </div>
    </div>
  );
};

export default MapStatusBar;
