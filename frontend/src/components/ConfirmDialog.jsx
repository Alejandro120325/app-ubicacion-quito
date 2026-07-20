import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button.jsx";

const ConfirmDialog = ({
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  description,
  icon: Icon = AlertTriangle,
  loading = false,
  onCancel,
  onConfirm,
  open,
  title
}) => {
  if (!open) return null;

  return (
    <motion.div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
    >
      <motion.div
        className="glass-card w-full max-w-md p-5 shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-lg border border-amber-300/25 bg-amber-400/15 p-3 text-amber-300">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <button
            aria-label="Cerrar"
            className="rounded-lg p-2 text-[var(--color-muted)] transition hover:bg-[var(--color-soft)] hover:text-[var(--color-text)] focus-ring"
            type="button"
            onClick={onCancel}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <h2 className="mt-4 text-xl font-bold text-[var(--color-text)]">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{description}</p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button className="w-full" disabled={loading} variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button className="w-full" disabled={loading} variant="danger" onClick={onConfirm}>
            {loading ? "Procesando..." : confirmLabel}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmDialog;
