import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CircleDollarSign,
  Code2,
  Globe2,
  KeyRound,
  MapPinned,
  ShieldAlert
} from "lucide-react";
import ApiInfoCard from "../../components/ApiInfoCard.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

const endpointKeys = [
  "api.endpoint.geocode",
  "api.endpoint.reverse",
  "api.endpoint.routing",
  "api.endpoint.places",
  "api.endpoint.isoline"
];

const riskKeys = ["api.risk.cost", "api.risk.privacy", "api.risk.internet"];

const AdminApi = () => {
  const { t } = useLanguage();

  const cards = [
    { icon: Building2, label: t("api.company"), value: t("api.companyValue") },
    { icon: MapPinned, label: t("api.type"), value: t("api.typeValue") },
    { icon: CircleDollarSign, label: t("api.cost"), value: t("api.costValue") },
    { icon: KeyRound, label: t("api.env"), value: "VITE_MAP_API_KEY" }
  ];

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
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            {t("api.status")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("api.title")}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">
            {t("api.summary")}
          </p>
        </div>
        <HeaderActions badges={[{ icon: Globe2, label: t("sidebar.api") }]} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <ApiInfoCard {...card} key={card.label} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text)]">
            <Code2 className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
            {t("api.endpoints")}
          </h2>
          <div className="mt-5 grid gap-3">
            {endpointKeys.map((key) => (
              <code
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] px-4 py-3 text-sm text-[var(--color-text)]"
                key={key}
              >
                {t(key)}
              </code>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--color-text)]">{t("api.why")}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {t("api.whyValue")}
            </p>
          </article>
          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text)]">
              <ShieldAlert className="h-5 w-5 text-amber-500" aria-hidden="true" />
              {t("api.risks")}
            </h2>
            <ul className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
              {riskKeys.map((key) => (
                <li className="rounded-lg bg-[var(--color-soft)] px-4 py-3" key={key}>
                  {t(key)}
                </li>
              ))}
            </ul>
          </article>
        </section>
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

export default AdminApi;
