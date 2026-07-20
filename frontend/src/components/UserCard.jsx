import React from "react";
import { motion } from "framer-motion";
import { Eye, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import Button from "./Button.jsx";

const UserCard = ({ onDelete, onView, user }) => {
  const { t } = useLanguage();
  const location = user.lastLocation;
  const isGpsReal = location?.simulated === false;
  const locationLabel = location?.address || location?.sector || t("admin.noData");

  return (
    <motion.article
      className="glass-card flex min-h-[210px] flex-col p-4 transition hover:!border-[var(--color-primary)]"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold text-[var(--color-text)]">{user.fullName}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{user.email}</span>
          </p>
        </div>
        <span
          className={`rounded-lg px-2 py-1 text-xs font-bold ${
            user.active
              ? "bg-green-50 text-green-700"
              : "bg-[var(--color-soft)] text-[var(--color-muted)]"
          }`}
        >
          {user.active ? t("common.active") : t("common.inactive")}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          {user.phone}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          <span className="line-clamp-2">{locationLabel}</span>
        </p>
        {isGpsReal ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
            GPS real{location?.accuracy != null ? ` - precision ${Math.round(location.accuracy)} m` : ""}
          </p>
        ) : null}
        <p className="text-xs">
          {t("admin.lastConnection")}: {user.lastConnection}
        </p>
      </div>

      <div className={`mt-auto grid gap-2 ${onDelete ? "sm:grid-cols-2" : ""}`}>
        <Button className="w-full" icon={Eye} size="sm" variant="secondary" onClick={onView}>
          {t("common.details")}
        </Button>
        {onDelete ? (
          <Button className="w-full" icon={Trash2} size="sm" variant="danger" onClick={() => onDelete(user)}>
            Eliminar
          </Button>
        ) : null}
      </div>
    </motion.article>
  );
};

export default UserCard;
