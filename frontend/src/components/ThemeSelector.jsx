import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { colorThemes, useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const ThemeSelector = () => {
  const { colorTheme, setColorTheme } = useTheme();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedTheme =
    colorThemes.find((theme) => theme.id === colorTheme) || colorThemes[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (themeId) => {
    setColorTheme(themeId);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={rootRef}>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute bottom-14 right-0 w-64 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-[var(--color-text)] shadow-soft"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
          >
            <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-muted)]">
              {t("theme.selectorLabel")}
            </p>
            <div className="grid gap-1">
              {colorThemes.map((theme) => {
                const isActive = theme.id === colorTheme;

                return (
                  <button
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                      isActive
                        ? "bg-[var(--color-soft)] text-[var(--color-primary)]"
                        : "text-[var(--color-muted)] hover:bg-[var(--color-soft)] hover:text-[var(--color-text)]"
                    }`}
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelect(theme.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full ring-2 ring-white/40"
                        style={{ backgroundColor: theme.color }}
                      />
                      {t(theme.labelKey)}
                    </span>
                    {isActive ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        aria-label={t("theme.selectorLabel")}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm font-bold text-[var(--color-text)] shadow-soft transition hover:border-[var(--color-primary)] focus-ring"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <Palette className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
        <span
          className="h-3 w-3 rounded-full ring-2 ring-white/40"
          style={{ backgroundColor: selectedTheme.color }}
        />
        <span className="hidden sm:inline">{selectedTheme.short}</span>
      </button>
    </div>
  );
};

export default ThemeSelector;
