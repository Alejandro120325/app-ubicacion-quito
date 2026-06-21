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
    <span className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </span>
    <div
      className={`flex items-center gap-3 rounded-lg border bg-white px-3 transition ${
        error
          ? "border-red-300 ring-4 ring-red-50"
          : "border-slate-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100"
      }`}
    >
      {Icon ? <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" /> : null}
      <input
        className="h-12 w-full min-w-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
        id={name}
        name={name}
        value={value}
        {...props}
      />
    </div>
    {error ? (
      <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
    ) : helperText ? (
      <p className="mt-2 text-sm text-slate-500">{helperText}</p>
    ) : null}
  </label>
);

export default InputField;
