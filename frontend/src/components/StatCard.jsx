import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, detail, icon: Icon, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    mint: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700"
  };

  return (
    <motion.article
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        {Icon ? (
          <span className={`rounded-lg p-3 ${tones[tone]}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {detail ? <p className="mt-4 text-sm text-slate-500">{detail}</p> : null}
    </motion.article>
  );
};

export default StatCard;
