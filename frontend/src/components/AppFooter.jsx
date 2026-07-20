import React from "react";
import InstitutionalInfo from "./InstitutionalInfo.jsx";

const AppFooter = ({ className = "" }) => (
  <footer className={`border-t border-[var(--color-border)] bg-slate-950/70 px-4 py-12 backdrop-blur-xl sm:px-6 lg:px-8 ${className}`}>
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-col gap-2 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            Información institucional
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">GeoKipu</h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-[var(--color-muted)]">
          Equipo, contacto y canales oficiales del proyecto.
        </p>
      </div>
      <InstitutionalInfo />
    </div>
  </footer>
);

export default AppFooter;
