import React from "react";
import { motion } from "framer-motion";
import { BellRing } from "lucide-react";
import AlertCard from "../../components/AlertCard.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAdminWorkspace } from "../../hooks/useAdminWorkspace.js";

const AdminAlerts = () => {
  const { t } = useLanguage();
  const { alerts, error, loading } = useAdminWorkspace();

  if (loading) {
    return <LoadingScreen message={t("admin.loading")} />;
  }

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
            {t("sidebar.alerts")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("alerts.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("alerts.subtitle")}
          </p>
        </div>
        <HeaderActions badges={[{ icon: BellRing, label: t("admin.stats.alerts") }]} />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4">
        {alerts.map((alert) => (
          <AlertCard alert={alert} key={alert.id} />
        ))}
      </section>
    </motion.section>
  );
};

export default AdminAlerts;
