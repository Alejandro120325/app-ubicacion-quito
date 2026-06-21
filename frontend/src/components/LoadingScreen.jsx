import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const LoadingScreen = ({ message = "Cargando informacion..." }) => (
  <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-slate-200 bg-white">
    <div className="text-center">
      <motion.span
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-sky-50 text-sky-700"
        animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <MapPin className="h-7 w-7" aria-hidden="true" />
      </motion.span>
      <p className="mt-4 text-sm font-semibold text-slate-600">{message}</p>
    </div>
  </div>
);

export default LoadingScreen;
