import React from "react";
import { motion } from "framer-motion";
import { RouteOff } from "lucide-react";
import Button from "../components/Button.jsx";

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
    <motion.section
      className="max-w-lg rounded-lg border border-slate-200 bg-white p-8 text-center shadow-soft"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
        <RouteOff className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-3xl font-bold text-slate-950">
        Página no encontrada
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        La ruta que intentas abrir no existe en esta primera versión.
      </p>
      <Button className="mt-6" to="/">
        Volver al inicio
      </Button>
    </motion.section>
  </main>
);

export default NotFound;
