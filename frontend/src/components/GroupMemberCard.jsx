import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Button from "./Button.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const statusClasses = {
  sharing: "bg-green-50 text-green-700",
  paused: "bg-amber-50 text-amber-700",
  offline: "bg-slate-100 text-slate-700"
};

const GroupMemberCard = ({ member, onView }) => {
  const { t } = useLanguage();
  const status = member.locationStatus || "paused";

  return (
    <motion.article
      className="glass-card flex min-h-[210px] flex-col p-4"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold text-[var(--color-text)]">{member.fullName}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{member.relation}</p>
        </div>
        <span className={`rounded-lg px-2 py-1 text-xs font-bold ${statusClasses[status]}`}>
          {t(`groups.status.${status}`)}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          <span className="truncate">{member.email}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          {member.phone}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          {member.lastLocation}
        </p>
        <p className="flex items-center gap-2 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-secondary)]" aria-hidden="true" />
          {member.lastUpdate}
        </p>
      </div>

      {onView ? (
        <Button className="mt-auto w-full" size="sm" variant="secondary" onClick={() => onView(member)}>
          {t("groups.viewLocation")}
        </Button>
      ) : null}
    </motion.article>
  );
};

export default GroupMemberCard;
