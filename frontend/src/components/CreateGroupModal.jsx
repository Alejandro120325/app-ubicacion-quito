import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "./Button.jsx";
import InputField from "./InputField.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const CreateGroupModal = ({ onClose, onSubmit, open }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", description: "" });

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(form);
    if (success !== false) {
      setForm({ name: "", description: "" });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <form
        className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-[var(--color-text)] shadow-soft"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{t("groups.create")}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{t("groups.subtitle")}</p>
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
          <InputField
            label={t("groups.name")}
            name="name"
            placeholder="Familia"
            value={form.name}
            onChange={handleChange}
          />
          <InputField
            label={t("groups.description")}
            name="description"
            placeholder={t("groups.descriptionPlaceholder")}
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("groups.create")}</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupModal;
