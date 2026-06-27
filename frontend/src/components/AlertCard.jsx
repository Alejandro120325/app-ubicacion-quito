import React from "react";
import { AlertTriangle, BellRing, CheckCircle2, Clock3, UserRound } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const toneClasses = {
  critical: "bg-rose-50 text-rose-700 border-rose-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-[var(--color-soft)] text-[var(--color-primary)] border-[var(--color-border)]"
};

const iconByType = {
  critical: AlertTriangle,
  warning: BellRing,
  info: CheckCircle2
};

const AlertCard = ({ alert }) => {
  const { t } = useLanguage();
  const Icon = iconByType[alert.type] || BellRing;

  return (
    <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition hover:border-[var(--color-primary)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${toneClasses[alert.type] || toneClasses.info}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-bold text-[var(--color-text)]">{alert.title}</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
              {alert.description}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center justify-center rounded-lg bg-[var(--color-soft)] px-3 py-2 text-xs font-bold text-[var(--color-muted)]">
          {alert.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-[var(--color-muted)] sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          {alert.person}
        </p>
        <p className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          {alert.date || t("persona.noData")}
        </p>
      </div>
    </article>
  );
};

export default AlertCard;
