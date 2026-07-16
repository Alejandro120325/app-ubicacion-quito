import React, { useEffect, useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import Button from "./Button.jsx";
import { getAutoLockSeconds, hasPin, LOCKED_KEY, verifyPin } from "../utils/security.js";
import { useAuth } from "../context/AuthContext.jsx";

const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];

const SecurityLock = () => {
  const { logout, token } = useAuth();
  const [locked, setLocked] = useState(localStorage.getItem(LOCKED_KEY) === "true");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return undefined;

    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.setItem(LOCKED_KEY, "true");
        setLocked(true);
      }, getAutoLockSeconds() * 1000);
    };

    activityEvents.forEach((eventName) => window.addEventListener(eventName, reset));
    reset();

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, reset));
    };
  }, [token]);

  if (!locked || !token) return null;

  const unlock = async () => {
    if (!hasPin()) {
      localStorage.removeItem(LOCKED_KEY);
      setLocked(false);
      return;
    }

    if (await verifyPin(pin)) {
      localStorage.removeItem(LOCKED_KEY);
      setLocked(false);
      setPin("");
      setError("");
      return;
    }

    setError("PIN incorrecto.");
  };

  const relogin = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/75 px-4 backdrop-blur-md">
      <section className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-soft">
        <span className="inline-flex rounded-lg bg-[var(--color-soft)] p-3 text-[var(--color-primary)]">
          <LockKeyhole className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-[var(--color-text)]">GeoKipu bloqueado</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Se ocultaron usuarios, grupos, ubicaciones y bitacora por inactividad.
        </p>

        {hasPin() ? (
          <input
            className="mt-5 h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] px-3 outline-none focus-ring"
            inputMode="numeric"
            maxLength={6}
            placeholder="Ingresa tu PIN"
            type="password"
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
          />
        ) : (
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
            Aun no tienes PIN local. Puedes configurarlo desde Perfil.
          </p>
        )}

        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button icon={LockKeyhole} onClick={unlock}>
            Desbloquear
          </Button>
          <Button icon={LogIn} variant="secondary" onClick={relogin}>
            Volver a login
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SecurityLock;
