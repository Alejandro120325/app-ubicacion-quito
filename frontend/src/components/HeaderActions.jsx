import React from "react";
import LanguageSelector from "./LanguageSelector.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const HeaderActions = ({ badges = [], children }) => (
  <div className="flex flex-wrap items-center gap-2">
    {badges.map((badge) => {
      const Icon = badge.icon;

      return (
        <span
          className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
            badge.className ||
            "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)]"
          }`}
          key={badge.label}
        >
          {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
          {badge.label}
        </span>
      );
    })}
    {children}
    <LanguageSelector compact />
    <ThemeToggle compact />
  </div>
);

export default HeaderActions;
