import React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

const PasswordField = ({ label, name, value, error, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
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
        <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
        <input
          className="h-12 w-full min-w-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          {...props}
        />
        <button
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-ring"
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
