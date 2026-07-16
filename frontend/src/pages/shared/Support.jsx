import React, { useState } from "react";
import { Github, HelpCircle, Instagram, Linkedin, PlayCircle } from "lucide-react";
import Button from "../../components/Button.jsx";
import OnboardingModal from "../../components/OnboardingModal.jsx";

const INSTAGRAM_URL = "https://instagram.com/";
const GITHUB_URL = "https://github.com/Alejandro120325";
const LINKEDIN_URL = "https://www.linkedin.com/in/jairo-alejandro-ojeda-herrera-9466543a6/";

const links = [
  { href: INSTAGRAM_URL, icon: Instagram, label: "Abrir Instagram" },
  { href: GITHUB_URL, icon: Github, label: "Abrir GitHub" },
  { href: LINKEDIN_URL, icon: Linkedin, label: "Abrir LinkedIn" }
];

const Support = () => {
  const [tutorialOpen, setTutorialOpen] = useState(false);

  return (
    <section className="mx-auto grid max-w-5xl gap-7">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
          Soporte tecnico
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
          Ayuda y canales oficiales
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          GeoKipu es un proyecto academico de ubicacion segura con consentimiento, bitacora,
          alertas, bloqueo local y contacto rapido.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="glass-card p-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Equipo</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Desarrollo orientado a seguridad, privacidad y seguimiento simulado para grupos de confianza.
          </p>
          <Button className="mt-5" icon={PlayCircle} variant="secondary" onClick={() => setTutorialOpen(true)}>
            Reabrir tutorial
          </Button>
        </article>

        <article className="glass-card p-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Reportar problema</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Describe el error, pantalla, usuario de prueba y pasos para reproducirlo.
          </p>
          <Button
            className="mt-5"
            icon={HelpCircle}
            onClick={() => {
              window.location.href = "mailto:soporte@geokipu.local?subject=Reporte%20GeoKipu";
            }}
          >
            Reportar problema
          </Button>
        </article>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <a
            className="glass-card flex min-h-24 items-center justify-center gap-3 p-5 text-center font-bold text-[var(--color-text)] transition hover:-translate-y-1 hover:border-[var(--color-primary)]"
            href={link.href}
            key={link.label}
            rel="noreferrer"
            target="_blank"
          >
            <link.icon className="h-5 w-5 text-[var(--color-primary)]" />
            {link.label}
          </a>
        ))}
      </section>

      <OnboardingModal forceOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </section>
  );
};

export default Support;
