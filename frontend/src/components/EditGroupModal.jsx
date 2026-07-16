import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button.jsx";
import InputField from "./InputField.jsx";

const EditGroupModal = ({ group, onClose, onSubmit, open }) => {
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (group) {
      setForm({
        name: group.name || "",
        description: group.description || ""
      });
    }
  }, [group]);

  if (!open || !group) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(group.id, form);
    if (success !== false) onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.form
        className="glass-card w-full max-w-md p-5 text-[var(--color-text)]"
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Editar grupo</h2>
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

        <div className="grid gap-4">
          <InputField label="Nombre" name="name" value={form.name} onChange={handleChange} />
          <InputField
            label="Descripcion"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar cambios</Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default EditGroupModal;
