import React, { useEffect, useState } from "react";
import { CheckCircle2, HelpCircle, X } from "lucide-react";
import Button from "./Button.jsx";

const SectionHelp = ({ bullets = [], description = "", storageKey, title = "Que puedes hacer aqui?" }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    setVisible(localStorage.getItem(storageKey) !== "true");
  }, [storageKey]);

  const close = () => {
    if (storageKey) localStorage.setItem(storageKey, "true");
    setVisible(false);
  };

  if (!visible) {
    return (
      <button
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-text)] focus-ring"
        type="button"
        onClick={() => setVisible(true)}
      >
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
        Ver ayuda
      </button>
    );
  }

  return (
    <aside className="glass-card grid gap-4 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-soft)] text-[var(--color-primary)]">
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-bold text-[var(--color-text)]">{title}</h2>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">
                {description}
              </p>
            ) : null}
            <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--color-muted)]">
              {bullets.slice(0, 3).map((item) => (
                <li className="flex gap-2" key={item}>
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-secondary)]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-soft)] focus-ring" type="button" onClick={close}>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <Button className="w-fit" icon={CheckCircle2} size="sm" onClick={close}>
        Entendido
      </Button>
    </aside>
  );
};

export default SectionHelp;
