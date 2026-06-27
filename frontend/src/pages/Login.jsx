import React from "react";
import { motion } from "framer-motion";
import { Home, KeyRound, Mail, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";
import PasswordField from "../components/PasswordField.jsx";
import SimulatedMap from "../components/SimulatedMap.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { validateLoginForm } from "../utils/validators.js";

const demoCredentials = [
  {
    role: "Admin",
    email: "admin@quitoapp.com",
    password: "Admin123"
  },
  {
    role: "Persona",
    email: "persona@quitoapp.com",
    password: "Persona123"
  }
];

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const isReady = useMemo(
    () => form.email.trim() && form.password.trim(),
    [form.email, form.password]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setErrors(validateLoginForm(nextForm, t));
    setServerError("");
  };

  const fillDemo = (credential) => {
    const nextForm = {
      email: credential.email,
      password: credential.password
    };
    setForm(nextForm);
    setErrors(validateLoginForm(nextForm, t));
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateLoginForm(form, t);
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/persona/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground className="min-h-screen px-4 py-8" showThemeToggle>
      <motion.main
        className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[0.95fr_1fr]"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28 }}
      >
        <section className="hidden lg:block">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-lg bg-white/15 p-3 text-white backdrop-blur">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-white">{t("app.name")}</p>
              <p className="text-sm text-sky-100">{t("login.access")}</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/10 p-3 shadow-soft backdrop-blur">
            <SimulatedMap className="border-white/10" large />
          </div>
        </section>

        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-[var(--color-text)] shadow-soft sm:p-8">
          <div className="mb-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-soft)] px-3 py-2 text-sm font-bold text-[var(--color-primary)]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {t("login.secure")}
              </p>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-soft)] focus-ring"
                to="/"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                {t("common.backHome")}
              </Link>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-[var(--color-text)]">
              {t("login.title")}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {t("login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <InputField
                autoComplete="email"
                error={errors.email}
                icon={Mail}
                label={t("login.email")}
                name="email"
                placeholder="correo@ejemplo.com"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <PasswordField
                autoComplete="current-password"
                error={errors.password}
                label={t("login.password")}
                name="password"
                placeholder={t("login.passwordPlaceholder")}
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {serverError ? (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {serverError}
              </div>
            ) : null}

            <Button
              className="mt-6 w-full"
              disabled={!isReady || loading}
              icon={KeyRound}
              size="lg"
              type="submit"
            >
              {loading ? t("login.loading") : t("home.signIn")}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
              <UserRound className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              {t("login.demoTitle")}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {demoCredentials.map((credential) => (
                <button
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-left text-sm transition hover:border-[var(--color-primary)] hover:bg-[var(--color-soft)] focus-ring"
                  key={credential.role}
                  type="button"
                  onClick={() => fillDemo(credential)}
                >
                  <p className="font-bold text-[var(--color-text)]">{credential.role}</p>
                  <p className="mt-1 break-words text-[var(--color-muted)]">
                    {credential.email}
                  </p>
                  <p className="mt-1 text-[var(--color-muted)]">{credential.password}</p>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-[var(--color-muted)]">
            {t("login.noAccount")}{" "}
            <Link className="font-semibold text-[var(--color-primary)] hover:underline" to="/register">
              {t("login.createPerson")}
            </Link>
          </p>
        </section>
      </motion.main>
    </AnimatedBackground>
  );
};

export default Login;
