import React from "react";
import { motion } from "framer-motion";
import { Eye, Mail, MapPin, Phone } from "lucide-react";
import Button from "./Button.jsx";

const UserCard = ({ onView, user }) => (
  <motion.article
    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200"
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-bold text-slate-950">{user.fullName}</p>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <Mail className="h-4 w-4" aria-hidden="true" />
          {user.email}
        </p>
      </div>
      <span
        className={`rounded-lg px-2 py-1 text-xs font-bold ${
          user.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-700"
        }`}
      >
        {user.active ? "Activo" : "Inactivo"}
      </span>
    </div>

    <div className="mt-4 grid gap-2 text-sm text-slate-600">
      <p className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
        {user.phone}
      </p>
      <p className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
        {user.lastLocation?.sector || "Sin ubicacion"} · Quito
      </p>
    </div>

    <Button className="mt-4 w-full" icon={Eye} size="sm" variant="secondary" onClick={onView}>
      Ver detalles
    </Button>
  </motion.article>
);

export default UserCard;
