import React from "react";
import { motion } from "framer-motion";
import { EyeOff, LockKeyhole, Power, ShieldCheck } from "lucide-react";
import Button from "../../components/Button.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { usePersonaWorkspace } from "../../hooks/usePersonaWorkspace.js";

const PersonaPrivacy = () => {
  const { t } = useLanguage();
  const { error, handleToggleSharing, loading, saving, sharing } = usePersonaWorkspace();

  if (loading) {
    return <LoadingScreen message={t("persona.loading")} />;
  }

  const controls = [
    { icon: ShieldCheck, title: t("privacy.consentTitle"), text: t("privacy.consentText") },
    { icon: LockKeyhole, title: t("privacy.dataTitle"), text: t("privacy.dataText") },
    { icon: EyeOff, title: t("privacy.pauseTitle"), text: t("privacy.pauseText") }
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
            {t("sidebar.privacy")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("persona.privacy")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("persona.privacyText")}
          </p>
        </div>
        <HeaderActions
          badges={[
            {
              className: sharing
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-[var(--color-border)] bg-[var(--color-soft)] text-[var(--color-muted)]",
              icon: ShieldCheck,
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

      <section className="grid gap-4 md:grid-cols-3">
        {controls.map((control) => (
          <article
            className="glass-card p-6"
            key={control.title}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-soft)] text-[var(--color-primary)]">
              <control.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-[var(--color-text)]">
              {control.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {control.text}
            </p>
          </article>
        ))}
      </section>

      <section className="glass-card p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              {sharing ? t("privacy.sharingTitle") : t("privacy.pausedTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {sharing ? t("privacy.sharingText") : t("privacy.pausedText")}
            </p>
          </div>
          <Button
            disabled={saving}
            icon={Power}
            size="lg"
            variant={sharing ? "dark" : "success"}
            onClick={handleToggleSharing}
          >
            {saving ? t("persona.updating") : sharing ? t("persona.pause") : t("persona.share")}
          </Button>
        </div>
      </section>
    </motion.section>
  );
};

export default PersonaPrivacy;
