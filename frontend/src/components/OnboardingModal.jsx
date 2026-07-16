import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, MapPinned, X } from "lucide-react";
import Button from "./Button.jsx";
import { ONBOARDING_STORAGE_KEY, onboardingSteps } from "../constants/onboarding.js";

const OnboardingModal = ({ forceOpen = false, onClose }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      setStep(0);
      return;
    }

    setOpen(localStorage.getItem(ONBOARDING_STORAGE_KEY) !== "true");
  }, [forceOpen]);

  if (!open) return null;

  const current = onboardingSteps[step];
  const isLast = step === onboardingSteps.length - 1;

  const finish = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setOpen(false);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <section className="w-full max-w-lg rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-lg bg-[var(--color-primary)] p-3 text-white">
            <MapPinned className="h-6 w-6" />
          </span>
          <button
            className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-soft)]"
            type="button"
            onClick={finish}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-5 text-sm font-bold text-[var(--color-primary)]">
          Paso {step + 1} de {onboardingSteps.length}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">{current.title}</h2>
        <p className="mt-3 leading-7 text-[var(--color-muted)]">{current.text}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={finish}>
            Saltar
          </Button>
          <Button icon={isLast ? CheckCircle2 : ArrowRight} onClick={isLast ? finish : () => setStep(step + 1)}>
            {isLast ? "Finalizar" : "Siguiente"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default OnboardingModal;
