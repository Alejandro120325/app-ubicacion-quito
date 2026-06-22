import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, detail, icon: Icon, tone = "blue" }) => {
  const tones = {
    blue: "bg-[var(--color-soft)] text-[var(--color-primary)]",
    mint: "bg-[var(--color-soft)] text-[var(--color-secondary)]",
    amber: "bg-[var(--color-soft)] text-[var(--color-alert)]",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-[var(--color-soft)] text-[var(--color-muted)]"
  };

  return (
    <motion.article
      className="flex min-h-[150px] flex-col justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition hover:border-[var(--color-primary)]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-muted)]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text)]">{value}</p>
        </div>
        {Icon ? (
          <span className={`rounded-lg p-3 ${tones[tone]}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {detail ? <p className="mt-4 text-sm text-[var(--color-muted)]">{detail}</p> : null}
    </motion.article>
  );
};

export default StatCard;
