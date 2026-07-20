import React from "react";
const InputField = ({
  label,
  name,
  value,
  error,
  icon: Icon,
  helperText,
  ...props
}) => (
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
      {Icon ? <Icon className="h-5 w-5 text-[var(--color-muted)]" aria-hidden="true" /> : null}
      <input
        className="min-h-12 w-full min-w-0 bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
        id={name}
        name={name}
        value={value}
        {...props}
      />
    </div>
    {error ? (
      <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
    ) : helperText ? (
      <p className="mt-2 text-sm text-[var(--color-muted)]">{helperText}</p>
    ) : null}
  </label>
);

export default InputField;
