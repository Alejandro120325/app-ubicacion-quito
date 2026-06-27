import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Power } from "lucide-react";
import Button from "../../components/Button.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SimulatedMap from "../../components/SimulatedMap.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { usePersonaWorkspace } from "../../hooks/usePersonaWorkspace.js";

const PersonaLocation = () => {
  const { t } = useLanguage();
  const {
    error,
    handleToggleSharing,
    loading,
    location,
    locationPoints,
    saving,
    sharing
  } = usePersonaWorkspace();

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
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            {t("sidebar.myLocation")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("persona.locationTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("persona.locationText")}
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

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-soft">
          <SimulatedMap
            lastUpdate={location?.lastUpdate}
            points={locationPoints}
            selectedLabel={location?.sector || t("persona.noSector")}
            variant="large"
          />
        </section>

        <aside className="grid gap-5">
          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
              {t("persona.currentStatus")}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
              {sharing ? t("persona.shared") : t("persona.paused")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {sharing ? t("persona.sharedText") : t("persona.pausedText")}
            </p>
            <Button
              className="mt-6 w-full"
              disabled={saving}
              icon={Power}
              size="lg"
              variant={sharing ? "dark" : "success"}
              onClick={handleToggleSharing}
            >
              {saving ? t("persona.updating") : sharing ? t("persona.pause") : t("persona.share")}
            </Button>
          </article>

          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
              <MapPin className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              {t("persona.lastSimulated")}
            </p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              {location?.sector || t("persona.noSector")} - Quito
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {t("persona.updatedAt", { value: location?.lastUpdate || t("persona.noData") })}
            </p>
          </article>
        </aside>
      </div>
    </motion.section>
  );
};

export default PersonaLocation;
