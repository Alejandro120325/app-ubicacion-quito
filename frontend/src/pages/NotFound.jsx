import React from "react";
import { motion } from "framer-motion";
import { RouteOff } from "lucide-react";
import Button from "../components/Button.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-10 text-[var(--color-text)]">
      <motion.section
        className="max-w-lg rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center shadow-soft"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--color-soft)] text-[var(--color-primary)]">
          <RouteOff className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-bold text-[var(--color-text)]">
          {t("notFound.title")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          {t("notFound.text")}
        </p>
        <Button className="mt-6" to="/">
          {t("notFound.action")}
        </Button>
      </motion.section>
    </main>
  );
};

export default NotFound;
