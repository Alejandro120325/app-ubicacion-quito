import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const LanguageSelector = ({ compact = false }) => {
  const { language, languages, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const currentLanguage =
    languages.find((availableLanguage) => availableLanguage.id === language) ||
    languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (languageId) => {
    setLanguage(languageId);
    setOpen(false);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-label={t("language.label")}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-ring ${
          compact ? "h-10 px-3 text-sm font-bold" : "px-3 py-2 text-sm font-semibold"
        }`}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <Globe2 className="h-4 w-4" aria-hidden="true" />
        <span>{currentLanguage.short}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-[var(--color-text)] shadow-soft"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.16 }}
          >
            {languages.map((availableLanguage) => {
              const isActive = availableLanguage.id === language;

              return (
                <button
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--color-soft)] text-[var(--color-primary)]"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-soft)] hover:text-[var(--color-text)]"
                  }`}
                  key={availableLanguage.id}
                  type="button"
                  onClick={() => handleSelect(availableLanguage.id)}
                >
                  <span>{t(`language.${availableLanguage.id}`)}</span>
                  {isActive ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
