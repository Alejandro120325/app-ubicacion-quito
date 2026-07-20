import React, { useState } from "react";
import { HelpCircle, Info, Mail, Phone, PlayCircle } from "lucide-react";
import Button from "../../components/Button.jsx";
import OnboardingModal from "../../components/OnboardingModal.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import { geokipuContact } from "../../constants/contact.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Support = () => {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const { user } = useAuth();
  const aboutPath = user?.role === "admin" ? "/admin/acerca" : "/persona/acerca";

  return (
    <section className="mx-auto grid max-w-5xl gap-7">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
          Soporte técnico
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
          Ayuda y canales oficiales
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Reporta problemas, vuelve a abrir el tutorial y accede a canales rápidos de ayuda.
        </p>
      </header>

      <SectionHelp
        storageKey="geokipu_guide_support_seen"
        title="Qué puedes hacer aquí?"
        description="Aquí encuentras ayuda operativa para usar GeoKipu sin mezclar información institucional."
        bullets={[
          "Reporta problemas de la aplicación.",
          "Abre correo o llamada rápida.",
          "Vuelve a revisar el tutorial general cuando lo necesites."
        ]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="glass-card p-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Tutorial</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Revisa nuevamente la guía inicial para recordar el flujo general de uso.
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
              window.location.href = `mailto:${geokipuContact.email}?subject=Reporte%20GeoKipu`;
            }}
          >
            Reportar problema
          </Button>
        </article>

        <article className="glass-card p-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Contacto rápido</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Usa correo o llamada para pedir ayuda sobre errores de acceso, perfil o navegación.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-soft)] focus-ring"
              href={`mailto:${geokipuContact.email}`}
            >
              <Mail className="h-5 w-5 text-[var(--color-secondary)]" />
              Enviar correo
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-soft)] focus-ring"
              href={geokipuContact.phoneHref}
            >
              <Phone className="h-5 w-5 text-[var(--color-secondary)]" />
              Llamar
            </a>
          </div>
        </article>
      </section>

      <article className="glass-card grid gap-4 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Información institucional</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            El equipo, redes sociales y oficinas ahora están separados en la sección Acerca de nosotros.
          </p>
        </div>
        <Button icon={Info} to={aboutPath} variant="secondary">
          Ver Acerca de nosotros
        </Button>
      </article>

      <OnboardingModal forceOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </section>
  );
};

export default Support;
