import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import Button from "../../components/Button.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import StatCard from "../../components/StatCard.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { usePersonaWorkspace } from "../../hooks/usePersonaWorkspace.js";

const PersonaDashboard = () => {
  const { t } = useLanguage();
  const { error, groups, loading, profile, sharing } = usePersonaWorkspace();

  const quickLinks = [
    { to: "/persona/ubicacion", label: t("sidebar.myLocation"), text: t("persona.quick.location"), icon: MapPin },
    { to: "/persona/grupos", label: t("sidebar.groups"), text: t("persona.quick.groups"), icon: UsersRound },
    { to: "/persona/privacidad", label: t("sidebar.privacy"), text: t("persona.quick.privacy"), icon: ShieldCheck }
  ];

  if (loading) {
    return <LoadingScreen message={t("persona.loading")} />;
  }

  return (
    <motion.section
      className="mx-auto grid max-w-7xl gap-8"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-secondary)]">
            {t("persona.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            {t("persona.greeting", { name: profile?.fullName })}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("persona.dashboardText")}
          </p>
        </div>
        <HeaderActions
          badges={[
            {
              className: sharing
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-[var(--color-border)] bg-[var(--color-soft)] text-[var(--color-muted)]",
              icon: BadgeCheck,
              label: sharing ? t("persona.shared") : t("persona.paused")
            }
          ]}
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <SectionHelp
        storageKey="geokipu_guide_persona_seen"
        title="Que puedes hacer aqui?"
        description="Este panel muestra tu estado personal, tus grupos y accesos rapidos de seguridad."
        bullets={[
          "Revisa si tu ubicacion esta compartida.",
          "Accede a tus grupos y privacidad.",
          "Entra al perfil para actualizar tus datos."
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          detail={sharing ? t("persona.sharedText") : t("persona.pausedText")}
          icon={MapPin}
          title={t("persona.currentStatus")}
          tone={sharing ? "mint" : "slate"}
          value={sharing ? t("groups.status.sharing") : t("groups.status.paused")}
        />
        <StatCard
          detail={t("persona.accountText")}
          icon={UserRound}
          title={t("persona.account")}
          tone="blue"
          value={profile?.language === "en" ? "EN" : "ES"}
        />
        <StatCard
          detail={t("groups.subtitle")}
          icon={UsersRound}
          title={t("sidebar.groups")}
          tone="mint"
          value={groups.length}
        />
      </div>

      <section className="glass-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
              {t("persona.quickTitle")}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
              {t("persona.quickHeading")}
            </h2>
          </div>
          <Button icon={ArrowRight} to="/persona/ubicacion" variant="secondary">
            {t("sidebar.myLocation")}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Button
              className="min-h-[118px] w-full justify-start whitespace-normal px-4 py-4 text-left"
              icon={link.icon}
              key={link.to}
              to={link.to}
              variant="secondary"
            >
              <span>
                <span className="block font-bold">{link.label}</span>
                <span className="mt-1 block text-sm font-normal text-[var(--color-muted)]">
                  {link.text}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </section>
    </motion.section>
  );
};

export default PersonaDashboard;
