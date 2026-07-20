import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  MapPin,
  UserCheck,
  UsersRound,
  UserX,
  Wifi
} from "lucide-react";
import Button from "../../components/Button.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import StatCard from "../../components/StatCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAdminWorkspace } from "../../hooks/useAdminWorkspace.js";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { alerts, error, loading, stats } = useAdminWorkspace();

  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat(language === "en" ? "en-US" : "es-EC", {
        weekday: "long",
        day: "2-digit",
        month: "long"
      }).format(new Date()),
    [language]
  );

  const quickLinks = [
    { to: "/admin/personas", label: t("sidebar.people"), text: t("admin.quick.people"), icon: UsersRound },
    { to: "/admin/grupos", label: t("sidebar.groups"), text: t("admin.quick.groups"), icon: UsersRound },
    { to: "/admin/mapa", label: t("sidebar.map"), text: t("admin.quick.map"), icon: MapPin },
    { to: "/admin/alertas", label: t("sidebar.alerts"), text: "Revisa eventos importantes y contactos rapidos.", icon: AlertTriangle }
  ];

  if (loading) {
    return <LoadingScreen message={t("admin.loading")} />;
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
            {t("admin.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            {t("admin.greeting", { name: user.fullName })}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("admin.dashboardText")}
          </p>
        </div>

        <HeaderActions
          badges={[
            {
              className: "border-amber-200 bg-amber-50 text-amber-800",
              icon: AlertTriangle,
              label: t("admin.simulated")
            },
            { icon: CalendarDays, label: currentDate },
            { icon: Wifi, label: t("admin.systemActive") }
          ]}
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <SectionHelp
        storageKey="geokipu_guide_admin_seen"
        title="Que puedes hacer aqui?"
        description="Este panel permite supervisar usuarios, grupos, ubicaciones y alertas de seguridad."
        bullets={[
          "Revisa cuantas personas y grupos estan registrados.",
          "Entra a Personas o Grupos para administrar datos.",
          "Usa Alertas y Bitacora para revisar eventos importantes."
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard detail={t("admin.stats.totalDetail")} icon={UsersRound} title={t("admin.stats.total")} tone="blue" value={stats.total} />
        <StatCard detail={t("admin.stats.activeDetail")} icon={UserCheck} title={t("admin.stats.active")} tone="mint" value={stats.active} />
        <StatCard detail={t("admin.stats.inactiveDetail")} icon={UserX} title={t("admin.stats.inactive")} tone="slate" value={stats.inactive} />
        <StatCard detail={t("admin.stats.groupsDetail")} icon={UsersRound} title={t("admin.stats.groups")} tone="blue" value={stats.groups} />
        <StatCard detail={t("admin.stats.alertsDetail")} icon={AlertTriangle} title={t("admin.stats.alerts")} tone="amber" value={stats.alerts} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-card p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            {t("admin.quickTitle")}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Button
                className="min-h-[108px] w-full justify-start whitespace-normal px-4 py-4 text-left"
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

        <section className="glass-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-secondary)]">
                {t("admin.activityTitle")}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
                {t("admin.activityHeading")}
              </h2>
            </div>
            <Button icon={ArrowRight} size="sm" to="/admin/alertas" variant="secondary">
              {t("sidebar.alerts")}
            </Button>
          </div>
          <div className="mt-5 grid gap-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4"
                key={alert.id}
              >
                <p className="font-bold text-[var(--color-text)]">{alert.title}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {alert.person} - {alert.status}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.section>
  );
};

export default AdminDashboard;
