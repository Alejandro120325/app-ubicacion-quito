import React, { useState } from "react";
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
  locationStatus: "sharing"
};

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <form
        className="w-full max-w-2xl rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-[var(--color-text)] shadow-soft"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{t("groups.addMember")}</h2>
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
          <InputField
            label={t("groups.relation")}
            name="relation"
            placeholder={t("groups.relationPlaceholder")}
            value={form.relation}
            onChange={handleChange}
          />
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
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("groups.addMember")}</Button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberModal;
