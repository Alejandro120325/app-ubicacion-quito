import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Home, IdCard, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";
import PasswordField from "../components/PasswordField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { validateRegisterForm } from "../utils/validators.js";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  language: "",
  cedula: "",
  phone: ""
};

const passwordRules = [
  { labelKey: "register.ruleLength", test: (value) => value.length >= 8 },
  { labelKey: "register.ruleUpper", test: (value) => /[A-Z]/.test(value) },
  { labelKey: "register.ruleLower", test: (value) => /[a-z]/.test(value) },
  { labelKey: "register.ruleNumber", test: (value) => /\d/.test(value) }
];

const Register = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordScore = useMemo(
    () => passwordRules.filter((rule) => rule.test(form.password)).length,
    [form.password]
  );

  const strengthLabels = [
    t("register.weak0"),
    t("register.weak1"),
    t("register.weak2"),
    t("register.weak3"),
    t("register.weak4")
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    const nextHasData = Object.values(nextForm).some((fieldValue) => fieldValue.trim());

    setForm(nextForm);
    setErrors(nextHasData ? validateRegisterForm(nextForm, t) : {});
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateRegisterForm(form, t);
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);
      await register(form);
      setMessage(t("register.success"));
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setMessage(error.response?.data?.message || t("register.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground className="min-h-screen px-4 py-8" showThemeToggle>
      <motion.main
        className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28 }}
      >
        <section className="glass-card w-full overflow-hidden text-[var(--color-text)]">
          <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
            <div className="hidden min-h-[680px] flex-col justify-between bg-slate-950 p-9 text-white lg:flex">
              <div>
                <p className="inline-flex rounded-lg bg-teal-400/15 px-3 py-2 text-sm font-bold text-teal-100">
                  {t("register.badge")}
                </p>
                <h1 className="mt-7 max-w-sm text-3xl font-bold leading-tight">{t("register.sideTitle")}</h1>
                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                  {t("register.sideText")}
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  t("register.checkCedula"),
                  t("register.checkPhone"),
                  t("register.checkPassword"),
                  t("register.checkRole")
                ].map((item) => (
                  <div className="flex items-center gap-3 text-sm" key={item}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-400/15 text-teal-100">
                      <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <form className="p-5 sm:p-8 lg:p-9" onSubmit={handleSubmit}>
              <div className="grid gap-5 border-b border-[var(--color-border)] pb-6 xl:grid-cols-[1fr_auto] xl:items-start">
                <div className="max-w-md">
                  <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-secondary)]">
                    {t("register.accountType")}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
                    {t("register.title")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {t("register.subtitle")}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:w-[260px]">
                  <Button className="w-full" icon={ArrowLeft} to="/login" variant="secondary">
                    {t("register.backLogin")}
                  </Button>
                  <Button className="w-full" icon={Home} to="/" variant="secondary">
                    {t("common.backHome")}
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    error={errors.fullName}
                    icon={UserRound}
                    label={t("register.fullName")}
                    name="fullName"
                    placeholder={t("register.fullNamePlaceholder")}
                    value={form.fullName}
                    onChange={handleChange}
                  />
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
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <PasswordField
                    autoComplete="new-password"
                    error={errors.password}
                    label={t("login.password")}
                    name="password"
                    placeholder={t("register.minPassword")}
                    value={form.password}
                    onChange={handleChange}
                  />
                  <PasswordField
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                    label={t("register.confirmPassword")}
                    name="confirmPassword"
                    placeholder={t("register.repeatPassword")}
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
                      <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                      {t("register.security")}
                    </p>
                    <span className="text-sm font-semibold text-[var(--color-muted)]">
                      {strengthLabels[passwordScore]}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                      style={{ width: `${Math.max(12, (passwordScore / 4) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(form.password);

                      return (
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            passed
                              ? "bg-green-50 text-green-700"
                              : "bg-[var(--color-card)] text-[var(--color-muted)]"
                          }`}
                          key={rule.labelKey}
                        >
                          {t(rule.labelKey)}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                      {t("register.language")}
                    </span>
                    <select
                      className={`min-h-12 w-full rounded-lg border bg-[var(--color-card)] px-3 text-[var(--color-text)] outline-none transition ${
                        errors.language
                          ? "border-red-300 ring-4 ring-red-50"
                          : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-ring)]"
                      }`}
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                    >
                      <option value="">{t("register.select")}</option>
                      <option value="es">{t("language.es")}</option>
                      <option value="en">{t("language.en")}</option>
                    </select>
                    {errors.language ? (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {errors.language}
                      </p>
                    ) : null}
                  </label>

                  <InputField
                    error={errors.cedula}
                    helperText={t("register.cedulaHelp")}
                    icon={IdCard}
                    label={t("register.cedula")}
                    maxLength="10"
                    name="cedula"
                    placeholder="1710000009"
                    value={form.cedula}
                    onChange={handleChange}
                  />
                  <InputField
                    error={errors.phone}
                    helperText={t("register.phoneHelp")}
                    icon={Phone}
                    label={t("register.phone")}
                    maxLength="10"
                    name="phone"
                    placeholder="0991234567"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                {message ? (
                  <div
                    className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                      Object.keys(errors).length === 0
                        ? "border-teal-200 bg-teal-50 text-teal-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                  >
                    {message}
                  </div>
                ) : null}

                <div className="grid gap-4 border-t border-[var(--color-border)] pt-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <p className="max-w-xl text-sm leading-6 text-[var(--color-muted)]">
                    {t("register.privacy")}
                  </p>
                  <Button
                    className="w-full sm:min-w-44"
                    disabled={loading}
                    icon={BadgeCheck}
                    size="lg"
                    type="submit"
                    variant="success"
                  >
                    {loading ? t("register.creating") : t("register.title")}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </motion.main>
    </AnimatedBackground>
  );
};

export default Register;
