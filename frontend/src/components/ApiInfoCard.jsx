import React from "react";

const ApiInfoCard = ({ icon: Icon, label, value }) => (
  <article className="glass-card p-5 transition hover:-translate-y-1 hover:!border-[var(--color-primary)]">
    {Icon ? (
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-soft)] text-[var(--color-primary)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    ) : null}
    <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
      {label}
    </h3>
    <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">{value}</p>
  </article>
);

export default ApiInfoCard;
