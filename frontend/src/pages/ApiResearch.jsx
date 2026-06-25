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
import { useLanguage } from "../context/LanguageContext.jsx";

const endpointKeys = [
  "api.endpoint.geocode",
  "api.endpoint.reverse",
  "api.endpoint.routing",
  "api.endpoint.places",
  "api.endpoint.isoline"
];

const riskKeys = ["api.risk.cost", "api.risk.privacy", "api.risk.internet"];

const ApiResearch = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      className="mx-auto max-w-7xl"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-soft">
        <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-soft)] px-3 py-2 text-sm font-bold text-[var(--color-primary)]">
          <Globe2 className="h-4 w-4" aria-hidden="true" />
          {t("api.status")}
        </span>
        <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">
              {t("api.title")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {t("api.summary")}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Building2, label: t("api.company"), value: t("api.companyValue") },
              { icon: MapPinned, label: t("api.type"), value: t("api.typeValue") },
              { icon: CircleDollarSign, label: t("api.cost"), value: t("api.costValue") },
              { icon: KeyRound, label: t("api.env"), value: "VITE_MAP_API_KEY" }
            ].map((item) => (
              <article
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4"
                key={item.label}
              >
                <item.icon className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-[var(--color-text)]">
                  {item.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                  {item.value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text)]">
            <Code2 className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
            {t("api.endpoints")}
          </h2>
          <div className="mt-4 grid gap-3">
            {endpointKeys.map((key) => (
              <code
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] px-3 py-2 text-sm text-[var(--color-text)]"
                key={key}
              >
                {t(key)}
              </code>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--color-text)]">{t("api.why")}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {t("api.whyValue")}
            </p>
          </article>
          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text)]">
              <ShieldAlert className="h-5 w-5 text-amber-500" aria-hidden="true" />
              {t("api.risks")}
            </h2>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--color-muted)]">
              {riskKeys.map((key) => (
                <li className="rounded-lg bg-[var(--color-soft)] px-3 py-2" key={key}>
                  {t(key)}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-5">
        <h2 className="text-xl font-bold text-[var(--color-text)]">
          {t("api.recommendation")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          {t("api.recommendationValue")}
        </p>
      </section>
    </motion.section>
  );
};

export default ApiResearch;
