import React from "react";
import { motion } from "framer-motion";
import { Globe2, KeyRound, MapPinned, Route, ShieldCheck } from "lucide-react";
import ApiInfoCard from "../../components/ApiInfoCard.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

const PersonaApi = () => {
  const { t } = useLanguage();

  const cards = [
    { icon: MapPinned, label: t("api.persona.realMap"), value: t("api.persona.realMapText") },
    { icon: Route, label: t("api.persona.routes"), value: t("api.persona.routesText") },
    { icon: ShieldCheck, label: t("api.persona.consent"), value: t("api.persona.consentText") },
    { icon: KeyRound, label: t("api.env"), value: "VITE_MAP_API_KEY" }
  ];

  return (
    <motion.section
      className="mx-auto grid max-w-6xl gap-8"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            {t("sidebar.api")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("api.persona.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("api.persona.subtitle")}
          </p>
        </div>
        <HeaderActions badges={[{ icon: Globe2, label: t("api.title") }]} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <ApiInfoCard {...card} key={card.label} />
        ))}
      </div>

      <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-6">
        <h2 className="text-xl font-bold text-[var(--color-text)]">
          {t("api.recommendation")}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          {t("api.recommendationValue")}
        </p>
      </section>
    </motion.section>
  );
};

export default PersonaApi;
