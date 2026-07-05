import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button.jsx";
import InputField from "./InputField.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  cedula: "",
  relation: "",
  locationStatus: "sharing",
  lastLocation: ""
};

const relationOptions = [
  "mother",
  "father",
  "sibling",
  "friend",
  "safeContact",
  "other"
];

const AddMemberModal = ({ group, onClose, onSubmit, open }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);

  if (!open || !group) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(group.id, form);
    if (success !== false) {
      setForm(initialForm);
    }
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
            <h2 className="text-xl font-bold">{t("groups.addMember")}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{group.name}</p>
            <p className="mt-2 text-xs text-[var(--color-muted)]">{t("groups.emailHint")}</p>
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
          <InputField
            label={t("groups.memberName")}
            name="fullName"
            placeholder="Maria Torres"
            value={form.fullName}
            onChange={handleChange}
          />
          <InputField
            label={t("common.email")}
            name="email"
            placeholder="maria@example.com"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            label={t("common.phone")}
            maxLength="10"
            name="phone"
            placeholder="0991112222"
            value={form.phone}
            onChange={handleChange}
          />
          <InputField
            label={t("persona.cedula")}
            maxLength="10"
            name="cedula"
            placeholder="0926687856"
            value={form.cedula}
            onChange={handleChange}
          />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
              {t("groups.relation")}
            </span>
            <select
              className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-ring)]"
              name="relation"
              value={form.relation}
              onChange={handleChange}
            >
              <option value="">{t("register.select")}</option>
              {relationOptions.map((relation) => (
                <option key={relation} value={t(`groups.relations.${relation}`)}>
                  {t(`groups.relations.${relation}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
              {t("groups.status")}
            </span>
            <select
              className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-ring)]"
              name="locationStatus"
              value={form.locationStatus}
              onChange={handleChange}
            >
              <option value="sharing">{t("groups.status.sharing")}</option>
              <option value="paused">{t("groups.status.paused")}</option>
              <option value="offline">{t("groups.status.offline")}</option>
            </select>
          </label>
          <InputField
            label={t("groups.lastLocation")}
            name="lastLocation"
            placeholder="La Mariscal - Quito"
            value={form.lastLocation}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("groups.addMember")}</Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default AddMemberModal;
