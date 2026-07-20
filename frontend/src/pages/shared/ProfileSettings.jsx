import React, { useEffect, useState } from "react";
import { LockKeyhole, Save, ShieldCheck, UserRound } from "lucide-react";
import Button from "../../components/Button.jsx";
import InputField from "../../components/InputField.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import api, { getApiErrorMessage } from "../../api/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { saveAutoLockSeconds, savePin } from "../../utils/security.js";

const ProfileSettings = () => {
  const { updateUser, user } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    language: "es",
    emergencyContact: "",
    privacy: "Solo grupos de confianza",
    autoLockSeconds: "120",
    pin: "",
    sharingLocation: false
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      fullName: user.fullName || "",
      phone: user.phone || "",
      language: user.language || "es",
      sharingLocation: Boolean(user.sharingLocation)
    }));
  }, [user]);

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (form.pin && !/^\d{4,6}$/.test(form.pin)) {
        throw new Error("El PIN debe tener entre 4 y 6 digitos.");
      }

      const { data } = await api.patch(`/users/${user.id}`, {
        fullName: form.fullName,
        phone: form.phone,
        language: form.language
      });
      await updateUser(data.user);
      const sharingResponse = await api.patch("/location/share", { sharing: form.sharingLocation });
      if (sharingResponse.data?.user) {
        await updateUser(sharingResponse.data.user);
      }
      saveAutoLockSeconds(form.autoLockSeconds);

      if (form.pin) {
        await savePin(form.pin);
      }

      await api.post("/activity", {
        type: "profile_updated",
        priority: "info",
        message: "El usuario actualizo su perfil y configuracion de seguridad.",
        userId: user.id,
        userName: form.fullName
      });

      setMessage("Perfil actualizado correctamente.");
      setField("pin", "");
    } catch (requestError) {
      setError(requestError.normalizedMessage || requestError.message || getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-7">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
          Perfil y seguridad
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
          Editar perfil
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Actualiza datos personales, privacidad y bloqueo por inactividad. El correo se mantiene solo lectura.
        </p>
      </header>

      {message ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <SectionHelp
        storageKey="geokipu_guide_profile_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes administrar tus datos personales y opciones de seguridad."
        bullets={[
          "Actualiza nombre, telefono e idioma.",
          "Configura PIN local o privacidad si esta disponible.",
          "Revisa tu estado de ubicacion compartida."
        ]}
      />

      <form className="glass-card grid gap-5 p-6" onSubmit={saveProfile}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            icon={UserRound}
            label="Nombre completo"
            name="fullName"
            value={form.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
          />
          <InputField
            label="Telefono"
            name="phone"
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
          />
          <InputField
            label="Correo"
            name="email"
            readOnly
            value={user?.email || ""}
          />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">Idioma</span>
            <select
              className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 focus-ring"
              value={form.language}
              onChange={(event) => setField("language", event.target.value)}
            >
              <option value="es">Espanol</option>
              <option value="en">English</option>
            </select>
          </label>
          <InputField
            label="Contacto de emergencia"
            name="emergencyContact"
            value={form.emergencyContact}
            onChange={(event) => setField("emergencyContact", event.target.value)}
          />
          <InputField
            label="Privacidad"
            name="privacy"
            value={form.privacy}
            onChange={(event) => setField("privacy", event.target.value)}
          />
          <InputField
            icon={LockKeyhole}
            label="PIN local (4 a 6 digitos)"
            maxLength={6}
            name="pin"
            type="password"
            value={form.pin}
            onChange={(event) => setField("pin", event.target.value.replace(/\D/g, ""))}
          />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
              Bloqueo por inactividad
            </span>
            <select
              className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 focus-ring"
              value={form.autoLockSeconds}
              onChange={(event) => setField("autoLockSeconds", event.target.value)}
            >
              <option value="30">30 segundos demo</option>
              <option value="120">2 minutos</option>
              <option value="300">5 minutos</option>
            </select>
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
          <input
            checked={form.sharingLocation}
            type="checkbox"
            onChange={(event) => setField("sharingLocation", event.target.checked)}
          />
          <span className="text-sm font-semibold text-[var(--color-text)]">
            Activar o pausar compartir ubicacion
          </span>
        </label>

        <Button className="w-full sm:w-fit" disabled={saving} icon={saving ? ShieldCheck : Save} type="submit">
          {saving ? "Guardando..." : "Guardar perfil"}
        </Button>
      </form>
    </section>
  );
};

export default ProfileSettings;
