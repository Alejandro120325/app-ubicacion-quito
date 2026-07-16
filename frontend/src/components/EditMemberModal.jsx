import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button.jsx";
import InputField from "./InputField.jsx";

const EditMemberModal = ({ group, member, onClose, onSubmit, open }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    relation: "",
    locationStatus: "sharing",
    lastLocation: ""
  });

  useEffect(() => {
    if (member) {
      setForm({
        fullName: member.fullName || "",
        email: member.email || "",
        phone: member.phone || "",
        relation: member.relation || "",
        locationStatus: member.locationStatus || "sharing",
        lastLocation: member.lastLocation || ""
      });
    }
  }, [member]);

  if (!open || !group || !member) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(group.id, member.id, form);
    if (success !== false) onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.form
        className="glass-card w-full max-w-2xl p-5 text-[var(--color-text)]"
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Editar integrante</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{group.name}</p>
          </div>
          <button
            className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-soft)] focus-ring"
            type="button"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Nombre" name="fullName" value={form.fullName} onChange={handleChange} />
          <InputField label="Correo" name="email" type="email" value={form.email} onChange={handleChange} />
          <InputField label="Telefono" name="phone" value={form.phone} onChange={handleChange} />
          <InputField label="Relacion" name="relation" value={form.relation} onChange={handleChange} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
              Estado ubicacion
            </span>
            <select
              className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-ring)]"
              name="locationStatus"
              value={form.locationStatus}
              onChange={handleChange}
            >
              <option value="sharing">Compartiendo</option>
              <option value="paused">Pausado</option>
              <option value="offline">Sin conexion</option>
            </select>
          </label>
          <InputField
            label="Ultima ubicacion"
            name="lastLocation"
            value={form.lastLocation}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar integrante</Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default EditMemberModal;
