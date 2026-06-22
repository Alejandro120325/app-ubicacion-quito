import React from "react";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const ThemeToggle = ({ compact = false }) => {
  const { isDark, toggleMode } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      title={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-ring ${
        compact ? "h-10 w-10 p-0" : "px-3 py-2 text-sm font-semibold"
      }`}
      type="button"
      onClick={toggleMode}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
      {compact ? null : <span>{isDark ? t("theme.toggle.light") : t("theme.toggle.dark")}</span>}
    </button>
  );
};

export default ThemeToggle;
