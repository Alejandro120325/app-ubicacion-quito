import React from "react";
import { motion } from "framer-motion";
import { Edit3, Trash2, UserPlus, UsersRound } from "lucide-react";
import Button from "./Button.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const GroupCard = ({ active = false, group, onAddMember, onDelete, onEdit, onSelect }) => {
  const { t } = useLanguage();

  return (
    <motion.article
      className={`glass-card p-4 transition ${
        active
          ? "!border-[var(--color-primary)]"
          : "hover:!border-[var(--color-primary)]"
      }`}
      whileHover={{ y: -3 }}
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
        {onSelect ? (
          <Button size="sm" variant={active ? "primary" : "secondary"} onClick={() => onSelect(group)}>
            Ver detalles
          </Button>
        ) : null}
        {onEdit ? (
          <Button icon={Edit3} size="sm" variant="secondary" onClick={() => onEdit(group)}>
            Editar grupo
          </Button>
        ) : null}
        {onAddMember ? (
          <Button icon={UserPlus} size="sm" variant="secondary" onClick={() => onAddMember(group)}>
            Agregar integrante
          </Button>
        ) : null}
        {onDelete ? (
          <Button icon={Trash2} size="sm" variant="danger" onClick={() => onDelete(group)}>
            Eliminar grupo
          </Button>
        ) : null}
        {!onSelect && !onEdit && !onAddMember && !onDelete ? (
          <Button size="sm" variant={active ? "primary" : "secondary"}>
          Ver detalles
          </Button>
        ) : null}
      </div>
    </motion.article>
  );
};

export default GroupCard;
