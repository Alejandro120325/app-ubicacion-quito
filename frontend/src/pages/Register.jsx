import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, IdCard, Mail, Phone, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";
import PasswordField from "../components/PasswordField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
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

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const formHasData = useMemo(
    () => Object.values(form).some((value) => value.trim()),
    [form]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setErrors(formHasData ? validateRegisterForm(nextForm) : {});
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateRegisterForm(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);
      await register(form);
      setMessage("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setMessage(
        error.response?.data?.message ||
          "No pudimos crear la cuenta. Revisa los datos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground className="min-h-screen px-4 py-8">
      <motion.main
        className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-5xl items-center"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28 }}
      >
        <section className="w-full overflow-hidden rounded-lg bg-white text-slate-900 shadow-soft">
          <div className="grid lg:grid-cols-[0.75fr_1fr]">
            <div className="hidden bg-slate-950 p-8 text-white lg:block">
              <p className="inline-flex rounded-lg bg-teal-400/15 px-3 py-2 text-sm font-bold text-teal-100">
                Registro persona
              </p>
              <h1 className="mt-6 text-3xl font-bold">
                Controla cuándo compartes tu ubicación.
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Esta cuenta no crea perfiles admin. Es una experiencia simple
                para validar datos personales y el flujo de seguridad.
              </p>
              <div className="mt-8 grid gap-3">
                {[
                  "Cédula ecuatoriana validada",
                  "Teléfono celular con formato 09",
                  "Contraseña segura",
                  "Rol persona asignado automáticamente"
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

            <form className="p-5 sm:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-teal-600">
                    Cuenta tipo persona
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-950">
                    Crear cuenta
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Completa tus datos para activar tu panel personal.
                  </p>
                </div>
                <Link
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-ring"
                  to="/login"
                >
                  Volver al login
                </Link>
              </div>

              <div className="mt-6 grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    error={errors.fullName}
                    icon={UserRound}
                    label="Nombres completos"
                    name="fullName"
                    placeholder="Ej. Ana Carolina Ruiz"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                  <InputField
                    autoComplete="email"
                    error={errors.email}
                    icon={Mail}
                    label="Correo"
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
                    label="Contraseña"
                    name="password"
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <PasswordField
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Idioma
                    </span>
                    <select
                      className={`h-12 w-full rounded-lg border bg-white px-3 text-slate-900 outline-none transition ${
                        errors.language
                          ? "border-red-300 ring-4 ring-red-50"
                          : "border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      }`}
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona</option>
                      <option value="es">Español</option>
                      <option value="en">Inglés</option>
                    </select>
                    {errors.language ? (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {errors.language}
                      </p>
                    ) : null}
                  </label>

                  <InputField
                    error={errors.cedula}
                    helperText="Debe tener 10 dígitos."
                    icon={IdCard}
                    label="Cédula ecuatoriana"
                    maxLength="10"
                    name="cedula"
                    placeholder="1710000009"
                    value={form.cedula}
                    onChange={handleChange}
                  />
                  <InputField
                    error={errors.phone}
                    helperText="Ej. 0991234567"
                    icon={Phone}
                    label="Teléfono"
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

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-slate-500">
                    Tú decides cuándo compartir tu ubicación desde tu panel.
                  </p>
                  <Button
                    disabled={loading}
                    icon={BadgeCheck}
                    size="lg"
                    type="submit"
                    variant="success"
                  >
                    {loading ? "Creando..." : "Crear cuenta"}
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
