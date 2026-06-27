import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  Code2,
  Globe2,
  HeartHandshake,
  LogOut,
  LockKeyhole,
  MapPinned,
  PanelLeftOpen,
  Radar,
  Route,
  UserPlus,
  UsersRound
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Button from "../components/Button.jsx";
import Navbar from "../components/Navbar.jsx";
import SimulatedMap from "../components/SimulatedMap.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/persona/dashboard";
  const apiPath = isAuthenticated
    ? user?.role === "admin"
      ? "/admin/api"
      : "/persona/api"
    : "/login";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const benefits = [
    {
      title: t("home.benefit.location.title"),
      text: t("home.benefit.location.text"),
      icon: MapPinned
    },
    {
      title: t("home.benefit.privacy.title"),
      text: t("home.benefit.privacy.text"),
      icon: LockKeyhole
    },
    {
      title: t("home.benefit.family.title"),
      text: t("home.benefit.family.text"),
      icon: HeartHandshake
    },
    {
      title: t("home.benefit.admin.title"),
      text: t("home.benefit.admin.text"),
      icon: PanelLeftOpen
    }
  ];

  const steps = [
    { title: t("home.step1.title"), text: t("home.step1.text") },
    { title: t("home.step2.title"), text: t("home.step2.text") },
    { title: t("home.step3.title"), text: t("home.step3.text") }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />

      <motion.main
        className="page-transition pb-24"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <AnimatedBackground className="min-h-[760px]">
          <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-14">
            <div>
              <motion.span
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-sky-100 backdrop-blur"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Radar className="h-4 w-4" aria-hidden="true" />
                {t("home.eyebrow")}
              </motion.span>

              <motion.h1
                className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                {t("home.title")}
              </motion.h1>

              <motion.p
                className="mt-5 max-w-2xl text-lg leading-8 text-sky-50"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                {t("home.subtitle")}
              </motion.p>

              <motion.p
                className="mt-4 max-w-2xl text-base leading-7 text-slate-200"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t("home.description")}
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
              >
                {isAuthenticated ? (
                  <>
                    <Button icon={ArrowRight} size="lg" to={dashboardPath}>
                      {t("home.goPanel")}
                    </Button>
                    <Button icon={LogOut} size="lg" variant="secondary" onClick={handleLogout}>
                      {t("sidebar.logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button icon={ArrowRight} size="lg" to="/login">
                      {t("home.signIn")}
                    </Button>
                    <Button icon={UserPlus} size="lg" to="/register" variant="secondary">
                      {t("home.createAccount")}
                    </Button>
                  </>
                )}
              </motion.div>

              <motion.div
                className="mt-8 grid gap-3 sm:grid-cols-3"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  [t("home.stat.roles.value"), t("home.stat.roles.label")],
                  [t("home.stat.simulated.value"), t("home.stat.simulated.label")],
                  [t("home.stat.city.value"), t("home.stat.city.label")]
                ].map(([value, label]) => (
                  <div
                    className="min-h-[88px] rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur"
                    key={label}
                  >
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="mt-1 text-sm text-slate-200">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="mx-auto w-full max-w-md"
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.35 }}
            >
              <div className="rounded-lg border border-white/20 bg-white/15 p-3 shadow-soft backdrop-blur">
                <div className="rounded-lg bg-slate-950 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3 px-1 text-white">
                    <div>
                      <p className="text-xs text-slate-300">{t("home.mockCircle")}</p>
                      <p className="font-bold">{t("home.mockFamily")}</p>
                    </div>
                    <span className="rounded-lg bg-green-400/15 px-2 py-1 text-xs font-bold text-green-200">
                      {t("home.active")}
                    </span>
                  </div>
                  <SimulatedMap className="border-white/10" large />
                </div>
              </div>
            </motion.div>
          </section>
        </AnimatedBackground>

        <section className="bg-[var(--color-card)] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                {t("home.benefits")}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
                {t("home.benefitsTitle")}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <motion.article
                  className="flex min-h-[185px] flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition hover:border-[var(--color-primary)] hover:bg-[var(--color-soft)]"
                  key={benefit.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-soft)] text-[var(--color-primary)]">
                    <benefit.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[var(--color-text)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {benefit.text}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-14">
          <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-secondary)]">
                {t("home.how")}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
                {t("home.howTitle")}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
                {t("home.howText")}
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step, index) => (
                <motion.article
                  className="flex min-h-[94px] gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
                  key={step.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-[var(--color-text)]">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                      {step.text}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] bg-[var(--color-card)] py-14">
          <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                {t("api.status")}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
                {t("api.title")}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
                {t("api.summary")}
              </p>
              <Button className="mt-6" icon={Globe2} to={apiPath} variant="secondary">
                {t("sidebar.api")}
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [t("api.company"), t("api.companyValue")],
                [t("api.cost"), t("api.costValue")],
                [t("api.why"), t("api.whyValue")],
                [t("api.env"), "VITE_MAP_API_KEY"]
              ].map(([label, value]) => (
                <article
                  className="min-h-[150px] rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-5"
                  key={label}
                >
                  <Code2 className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                  <h3 className="mt-3 font-bold text-[var(--color-text)]">{label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {value}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-card)] py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
                <Route className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
                {t("home.ready")}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {t("home.readyText")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {isAuthenticated ? (
                <>
                  <Button icon={UsersRound} to={dashboardPath} variant="dark">
                    {t("home.goPanel")}
                  </Button>
                  <Button icon={LogOut} variant="secondary" onClick={handleLogout}>
                    {t("sidebar.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Button icon={UsersRound} to="/login" variant="dark">
                    {t("home.tryLogin")}
                  </Button>
                  <Button icon={BellRing} to="/register" variant="secondary">
                    {t("home.registerPerson")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] px-4 py-6 text-sm text-[var(--color-muted)] sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-[var(--color-text)]">{t("home.title")}</p>
            <p>{t("home.footer")}</p>
          </div>
        </footer>
      </motion.main>
    </div>
  );
};

export default Home;
