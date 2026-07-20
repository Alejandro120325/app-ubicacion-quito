import React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const PasswordField = ({ label, name, value, error, ...props }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
        {label}
      </span>
      <div
        className={`glass-input flex min-h-12 items-center gap-3 rounded-lg border px-3 transition ${
          error
            ? "border-red-300 ring-4 ring-red-50"
            : "border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-ring)]"
        }`}
      >
        <Lock className="h-5 w-5 text-[var(--color-muted)]" aria-hidden="true" />
        <input
          className="min-h-12 w-full min-w-0 bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          {...props}
        />
        <button
          aria-label={visible ? t("password.hide") : t("password.show")}
          className="rounded-lg p-2 text-[var(--color-muted)] transition hover:bg-[var(--color-soft)] hover:text-[var(--color-text)] focus-ring"
          title={visible ? t("password.hide") : t("password.show")}
          type="button"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
    </label>
  );
};

export default PasswordField;
