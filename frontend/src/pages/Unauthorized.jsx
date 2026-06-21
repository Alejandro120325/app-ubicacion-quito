import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Unauthorized = () => {
  const { user } = useAuth();
  const panelPath = user?.role === "admin" ? "/admin/dashboard" : "/persona/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <motion.section
        className="max-w-lg rounded-lg border border-slate-200 bg-white p-8 text-center shadow-soft"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
          <ShieldAlert className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-bold text-slate-950">
          No tienes permiso para acceder a esta sección.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Tu rol actual no corresponde a esta ruta. Puedes volver al dashboard
          correcto y continuar desde ahí.
        </p>
        <Button className="mt-6" to={user ? panelPath : "/login"}>
          Volver al dashboard
        </Button>
      </motion.section>
    </main>
  );
};

export default Unauthorized;
