import React from "react";
import { ExternalLink, Github, Instagram, Linkedin, Mail, MapPin, Phone, UsersRound } from "lucide-react";
import { geokipuContact, geokipuSocialLinks, geokipuTeam } from "../constants/contact.js";

const socialIcons = {
  GitHub: Github,
  Instagram,
  LinkedIn: Linkedin
};

const panelClass =
  "flex min-h-[255px] flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-soft";

const titleClass =
  "flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]";

const InstitutionalInfo = ({ className = "" }) => (
  <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-4 ${className}`}>
    <section className={panelClass}>
      <p className={titleClass}>
        <UsersRound className="h-4 w-4" aria-hidden="true" />
        Equipo del proyecto
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {geokipuTeam.map((member) => (
          <span
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-soft)] px-4 text-sm font-semibold text-[var(--color-text)]"
            key={member}
          >
            {member}
          </span>
        ))}
      </div>
    </section>

    <section className={panelClass}>
      <p className={titleClass}>Contacto GeoKipu</p>
      <div className="mt-5 grid gap-3 text-sm text-[var(--color-muted)]">
        <p className="font-bold text-[var(--color-text)]">{geokipuContact.company}</p>
        <a className="flex items-start gap-2 hover:text-[var(--color-text)]" href={`mailto:${geokipuContact.email}`}>
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-secondary)]" aria-hidden="true" />
          {geokipuContact.email}
        </a>
        <a className="flex items-start gap-2 hover:text-[var(--color-text)]" href={geokipuContact.phoneHref}>
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-secondary)]" aria-hidden="true" />
          {geokipuContact.phone}
        </a>
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-secondary)]" aria-hidden="true" />
          <span>{geokipuContact.address}</span>
        </p>
        <p>{geokipuContact.schedule}</p>
      </div>
    </section>

    <section className={panelClass}>
      <p className={titleClass}>Redes sociales</p>
      <div className="mt-5 grid gap-3">
        {geokipuSocialLinks.map((link) => {
          const Icon = socialIcons[link.label] || Github;
          return (
            <a
              className="inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-card)] focus-ring"
              href={link.href}
              key={link.label}
              rel="noreferrer"
              target="_blank"
            >
              <span className="inline-flex items-center gap-3">
                <Icon className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                {link.label}
              </span>
              <ExternalLink className="h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </section>

    <section className={panelClass}>
      <iframe
        className="min-h-[180px] w-full rounded-lg border border-[var(--color-border)]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps?q=Av.%20Republica%20E7-123%20y%20Eloy%20Alfaro%20Quito%20Ecuador&output=embed"
        title="Mapa de oficinas GeoKipu"
      />
      <h2 className="mt-4 font-bold text-[var(--color-text)]">Oficinas GeoKipu</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--color-muted)]">
        {geokipuContact.address}
      </p>
      <a
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-[var(--color-primary-dark)] focus-ring"
        href={geokipuContact.mapsUrl}
        rel="noreferrer"
        target="_blank"
      >
        Ver en Google Maps
      </a>
    </section>
  </div>
);

export default InstitutionalInfo;
