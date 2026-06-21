import React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Globe2,
  HeartHandshake,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Power,
  ShieldCheck,
  UserRound,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/api.js";
import Button from "../components/Button.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import SimulatedMap from "../components/SimulatedMap.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const circleContacts = [
  {
    name: "Mamá",
    status: "Disponible",
    place: "La Carolina",
    active: true
  },
  {
    name: "Hermano",
    status: "En movimiento",
    place: "Universidad",
    active: true
  },
  {
    name: "Contacto seguro",
    status: "Pausado",
    place: "Centro Histórico",
    active: false
  }
];

const PersonaDashboard = () => {
  const { updateUser, user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [location, setLocation] = useState(null);
  const [sharing, setSharing] = useState(Boolean(user?.sharingLocation));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [meResponse, locationResponse] = await Promise.all([
          api.get("/users/me"),
          api.get(`/location/${user.id}`)
        ]);

        setProfile(meResponse.data.user);
        setSharing(Boolean(meResponse.data.user.sharingLocation));
        setLocation(locationResponse.data.location);
        updateUser(meResponse.data.user);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "No se pudo cargar tu información."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user.id]);

  const handleToggleSharing = async () => {
    try {
      setSaving(true);
      setError("");
      const nextSharing = !sharing;
      const { data } = await api.patch("/location/share", {
        sharing: nextSharing
      });

      setSharing(data.sharing);
      setProfile(data.user);
      updateUser(data.user);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "No se pudo actualizar el estado de ubicación."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Cargando tu panel personal..." />;
  }

  return (
    <motion.section
      className="mx-auto max-w-7xl"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-600">
            Panel persona
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Hola, {profile?.fullName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Comparte tu ubicación simulada de forma clara y controla tu privacidad.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
            sharing ? "bg-green-50 text-green-700" : "bg-slate-200 text-slate-700"
          }`}
        >
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          {sharing ? "Ubicación compartida" : "Ubicación pausada"}
        </span>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-slate-950 p-5 text-white">
            <p className="text-sm font-semibold text-sky-200">Estado actual</p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  {sharing ? "Ubicación compartida" : "Ubicación pausada"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {sharing
                    ? "Tu punto simulado aparece como activo para esta demostración."
                    : "El seguimiento está pausado. Puedes activarlo cuando quieras."}
                </p>
              </div>
              <motion.span
                className={`flex h-16 w-16 items-center justify-center rounded-lg ${
                  sharing ? "bg-teal-400 text-slate-950" : "bg-white/10 text-white"
                }`}
                animate={{ scale: sharing ? [1, 1.08, 1] : 1 }}
                transition={{ duration: 1.5, repeat: sharing ? Infinity : 0 }}
              >
                <MapPin className="h-8 w-8" aria-hidden="true" />
              </motion.span>
            </div>
          </div>

          <div className="mt-5">
            <SimulatedMap
              className="h-[360px]"
              lastUpdate={location?.lastUpdate}
              selectedLabel={location?.sector}
            />
          </div>

          <Button
            className="mt-5 w-full"
            disabled={saving}
            icon={Power}
            size="lg"
            variant={sharing ? "dark" : "success"}
            onClick={handleToggleSharing}
          >
            {saving
              ? "Actualizando..."
              : sharing
                ? "Pausar seguimiento"
                : "Compartir mi ubicación"}
          </Button>

          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-950">Última ubicación simulada</p>
            <p className="mt-2 text-sm text-slate-600">
              {location?.sector || "Sector no disponible"} · Quito
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Actualización: {location?.lastUpdate || "sin dato"}
            </p>
          </div>
        </section>

        <section className="grid gap-6">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Datos de la cuenta</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Estos datos pertenecen al perfil persona autenticado.
            </p>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Nombres completos",
                  value: profile?.fullName,
                  icon: UserRound
                },
                {
                  label: "Correo",
                  value: profile?.email,
                  icon: Mail
                },
                {
                  label: "Cédula",
                  value: profile?.cedula,
                  icon: IdCard
                },
                {
                  label: "Teléfono",
                  value: profile?.phone,
                  icon: Phone
                },
                {
                  label: "Idioma",
                  value: profile?.language === "en" ? "Inglés" : "Español",
                  icon: Globe2
                }
              ].map((item) => (
                <div className="rounded-lg border border-slate-200 p-4" key={item.label}>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </dt>
                  <dd className="mt-2 break-words font-bold text-slate-950">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="rounded-lg border border-teal-100 bg-teal-50 p-5">
            <div className="flex items-center gap-2 font-bold text-teal-900">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              Privacidad
            </div>
            <p className="mt-2 text-sm leading-6 text-teal-900">
              Tú decides cuándo compartir tu ubicación. Puedes pausar el
              seguimiento en cualquier momento.
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Círculo familiar simulado
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Contactos de ejemplo para visualizar cómo crecería la app.
                </p>
              </div>
              <span className="rounded-lg bg-sky-50 p-3 text-sky-700">
                <UsersRound className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {circleContacts.map((contact) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                  key={contact.name}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        contact.active
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-950">{contact.name}</p>
                      <p className="text-sm text-slate-500">{contact.place}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                    {contact.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </motion.section>
  );
};

export default PersonaDashboard;
