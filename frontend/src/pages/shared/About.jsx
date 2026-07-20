import React from "react";
import { Headphones, Info, ShieldCheck } from "lucide-react";
import Button from "../../components/Button.jsx";
import InstitutionalInfo from "../../components/InstitutionalInfo.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const About = () => {
  const { user } = useAuth();
  const supportPath = user?.role === "admin" ? "/admin/soporte" : "/persona/soporte";

  return (
    <section className="mx-auto grid max-w-7xl gap-7">
      <header className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            <Info className="h-4 w-4" aria-hidden="true" />
            Acerca de nosotros
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            Sobre GeoKipu
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">
            Información institucional del proyecto: equipo, canales oficiales, redes sociales y oficinas.
          </p>
        </div>
        <Button icon={Headphones} to={supportPath} variant="secondary">
          Ir a soporte
        </Button>
      </header>

      <SectionHelp
        storageKey="geokipu_guide_about_seen"
        title="Qué encuentras aquí?"
        description="Esta sección concentra la información institucional para mantener los paneles limpios."
        bullets={[
          "Consulta integrantes y datos de contacto.",
          "Abre redes sociales oficiales.",
          "Encuentra la referencia de oficinas en Google Maps."
        ]}
      />

      <InstitutionalInfo />

      <article className="glass-card grid gap-4 p-6 lg:grid-cols-[auto_1fr] lg:items-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-soft)] text-[var(--color-secondary)]">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            Proyecto académico con privacidad primero
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            GeoKipu mantiene la información institucional separada de las pantallas operativas para que el uso diario sea más claro.
          </p>
        </div>
      </article>
    </section>
  );
};

export default About;
