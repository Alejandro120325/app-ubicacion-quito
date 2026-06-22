import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const LoadingScreen = ({ message }) => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="text-center">
        <motion.span
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--color-soft)] text-[var(--color-primary)]"
          animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <MapPin className="h-7 w-7" aria-hidden="true" />
        </motion.span>
        <p className="mt-4 text-sm font-semibold text-[var(--color-muted)]">
          {message || t("admin.loading")}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
