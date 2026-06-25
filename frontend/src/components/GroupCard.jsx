import React from "react";
import { UsersRound } from "lucide-react";
import Button from "./Button.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const GroupCard = ({ active = false, group, onAddMember, onSelect }) => {
  const { t } = useLanguage();

  return (
    <article
      className={`rounded-lg border p-4 shadow-sm transition ${
        active
          ? "border-[var(--color-primary)] bg-[var(--color-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
            {t("groups.groupLabel")}
          </p>
          <h3 className="mt-1 text-lg font-bold text-[var(--color-text)]">{group.name}</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {group.description || t("groups.subtitle")}
          </p>
        </div>
        <span className="rounded-lg bg-[var(--color-card)] p-3 text-[var(--color-primary)]">
          <UsersRound className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
        <span className="rounded-lg bg-[var(--color-card)] px-2 py-1 font-semibold">
          {t("groups.members", { count: group.members?.length || 0 })}
        </span>
        <span className="rounded-lg bg-[var(--color-card)] px-2 py-1">
          {t("groups.createdBy", { id: group.createdBy })}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button size="sm" variant={active ? "primary" : "secondary"} onClick={() => onSelect(group)}>
          {t("common.details")}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onAddMember(group)}>
          {t("groups.addMember")}
        </Button>
      </div>
    </article>
  );
};

export default GroupCard;
