import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  HeartHandshake,
  LockKeyhole,
  MapPinned,
  PanelLeftOpen,
  Radar,
  Route,
  ShieldCheck,
  UserPlus,
  UsersRound
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Button from "../components/Button.jsx";
import Navbar from "../components/Navbar.jsx";
import SimulatedMap from "../components/SimulatedMap.jsx";

const benefits = [
  {
    title: "Compartir ubicación",
    text: "Activa o pausa tu estado cuando necesites que te puedan ubicar.",
    icon: MapPinned
  },
  {
    title: "Control de privacidad",
    text: "La persona decide cuándo compartir su ubicación simulada.",
    icon: LockKeyhole
  },
  {
    title: "Monitoreo familiar",
    text: "Visualiza estados sencillos para saber quién está activo o pausado.",
    icon: HeartHandshake
  },
  {
    title: "Panel administrativo",
    text: "Consulta usuarios, estados y alertas simuladas desde un panel claro.",
    icon: PanelLeftOpen
  }
];

const steps = [
  {
    title: "Crea tu cuenta",
    text: "Regístrate como persona con datos básicos y validaciones ecuatorianas."
  },
  {
    title: "Inicia sesión",
    text: "El sistema reconoce si eres admin o persona y te lleva a tu panel."
  },
  {
    title: "Controla tu estado",
    text: "Activa o pausa el uso compartido desde un botón grande y claro."
  }
];

const Home = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />

    <motion.main
      className="page-transition"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <AnimatedBackground className="min-h-[calc(100vh-65px)]">
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
          <div>
            <motion.span
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-sky-100 backdrop-blur"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Radar className="h-4 w-4" aria-hidden="true" />
              Seguridad familiar y ciudad conectada
            </motion.span>

            <motion.h1
              className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              Quito Ubicación Segura
            </motion.h1>

            <motion.p
              className="mt-5 max-w-2xl text-lg leading-8 text-sky-50"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
            >
              Comparte tu ubicación de forma segura en Quito y alrededores.
            </motion.p>

            <motion.p
              className="mt-4 max-w-2xl text-base leading-7 text-slate-200"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Una app universitaria con apariencia profesional para probar
              inicio de sesión, registro, roles y monitoreo urbano con datos
              simulados.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
            >
              <Button icon={ArrowRight} size="lg" to="/login">
                Iniciar sesión
              </Button>
              <Button icon={UserPlus} size="lg" to="/register" variant="secondary">
                Crear cuenta
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 grid gap-3 sm:grid-cols-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                ["2 roles", "Admin y persona"],
                ["100%", "Datos simulados"],
                ["Quito", "Sectores urbanos"]
              ].map(([value, label]) => (
                <div
                  className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur"
                  key={label}
                >
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-200">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-md"
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.35 }}
          >
            <div className="rounded-lg border border-white/20 bg-white/15 p-3 shadow-soft backdrop-blur">
              <div className="rounded-lg bg-slate-950 p-3">
                <div className="mb-3 flex items-center justify-between px-1 text-white">
                  <div>
                    <p className="text-xs text-slate-300">Circulo Quito Norte</p>
                    <p className="font-bold">Familia conectada</p>
                  </div>
                  <span className="rounded-lg bg-green-400/15 px-2 py-1 text-xs font-bold text-green-200">
                    Activo
                  </span>
                </div>
                <SimulatedMap className="h-[430px] border-white/10" />
              </div>
            </div>
            <motion.div
              className="absolute -bottom-5 left-5 right-5 rounded-lg border border-white/30 bg-white p-4 text-slate-900 shadow-soft"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="h-4 w-4 text-quito-mint" aria-hidden="true" />
                Ubicación compartida
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Último punto simulado: La Carolina · hace 2 min
              </p>
            </motion.div>
          </motion.div>
        </section>
      </AnimatedBackground>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-quito-blue">
              Beneficios
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Lo esencial para una primera versión sólida
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.article
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/40"
                key={benefit.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06 }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-quito-blue">
                  <benefit.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {benefit.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-quito-mint">
              ¿Cómo funciona?
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Simple de entender, fácil de presentar
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              El flujo se mantiene claro para que cualquier usuario pueda entrar,
              reconocer su rol y usar la app sin conocimientos técnicos.
            </p>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <motion.article
                className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {step.text}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Route className="h-4 w-4 text-quito-mint" aria-hidden="true" />
              Listo para probar con backend local
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Usa las credenciales de prueba o crea una cuenta tipo persona.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button icon={UsersRound} to="/login" variant="dark">
              Probar login
            </Button>
            <Button icon={BellRing} to="/register" variant="secondary">
              Registrar persona
            </Button>
          </div>
        </div>
      </section>
    </motion.main>
  </div>
);

export default Home;
