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
import { useEffect, useMemo, useState } from "react";
import api from "../api/api.js";
import Button from "../components/Button.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import SimulatedMap from "../components/SimulatedMap.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const PersonaDashboard = () => {
  const { updateUser, user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(user);
  const [location, setLocation] = useState(null);
  const [sharing, setSharing] = useState(Boolean(user?.sharingLocation));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const circleContacts = useMemo(
    () => [
      {
        name: t("persona.contactMom"),
        status: t("persona.available"),
        place: "La Carolina",
        active: true
      },
      {
        name: t("persona.contactBrother"),
        status: t("persona.moving"),
        place: "Universidad",
        active: true
      },
      {
        name: t("persona.safeContact"),
        status: t("persona.pausedStatus"),
        place: "Centro Histórico",
        active: false
      }
    ],
    [t]
  );

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
        setError(requestError.response?.data?.message || t("persona.loadError"));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user.id, t]);

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
      setError(requestError.response?.data?.message || t("persona.updateError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen message={t("persona.loading")} />;
  }

  return (
    <motion.section
      className="mx-auto max-w-7xl"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-secondary)]">
            {t("persona.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("persona.greeting", { name: profile?.fullName })}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("persona.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
              sharing
                ? "bg-green-50 text-green-700"
                : "bg-[var(--color-soft)] text-[var(--color-muted)]"
            }`}
          >
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            {sharing ? t("persona.shared") : t("persona.paused")}
          </span>
          <LanguageSelector compact />
          <ThemeToggle compact />
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section
          id="ubicacion"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
        >
          <div className="rounded-lg bg-slate-950 p-5 text-white">
            <p className="text-sm font-semibold text-sky-200">
              {t("persona.currentStatus")}
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  {sharing ? t("persona.shared") : t("persona.paused")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {sharing ? t("persona.sharedText") : t("persona.pausedText")}
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
              dashboard
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
            {saving ? t("persona.updating") : sharing ? t("persona.pause") : t("persona.share")}
          </Button>

          <div className="mt-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
            <p className="text-sm font-bold text-[var(--color-text)]">
              {t("persona.lastSimulated")}
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {location?.sector || t("persona.noSector")} - Quito
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {t("persona.updatedAt", { value: location?.lastUpdate || t("persona.noData") })}
            </p>
          </div>
        </section>

        <section className="grid gap-6">
          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {t("persona.account")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {t("persona.accountText")}
            </p>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: t("persona.fullName"),
                  value: profile?.fullName,
                  icon: UserRound
                },
                {
                  label: t("common.email"),
                  value: profile?.email,
                  icon: Mail
                },
                {
                  label: t("persona.cedula"),
                  value: profile?.cedula,
                  icon: IdCard
                },
                {
                  label: t("common.phone"),
                  value: profile?.phone,
                  icon: Phone
                },
                {
                  label: t("persona.language"),
                  value: profile?.language === "en" ? t("language.en") : t("language.es"),
                  icon: Globe2
                }
              ].map((item) => (
                <div
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4"
                  key={item.label}
                >
                  <dt className="flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)]">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </dt>
                  <dd className="mt-2 break-words font-bold text-[var(--color-text)]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>

          <article
            id="privacidad"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-5"
          >
            <div className="flex items-center gap-2 font-bold text-[var(--color-text)]">
              <ShieldCheck className="h-5 w-5 text-[var(--color-secondary)]" aria-hidden="true" />
              {t("persona.privacy")}
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {t("persona.privacyText")}
            </p>
          </article>

          <article
            id="circulo"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">
                  {t("persona.circle")}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {t("persona.circleText")}
                </p>
              </div>
              <span className="rounded-lg bg-[var(--color-soft)] p-3 text-[var(--color-primary)]">
                <UsersRound className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {circleContacts.map((contact) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-3"
                  key={contact.name}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        contact.active
                          ? "bg-green-50 text-green-700"
                          : "bg-[var(--color-card)] text-[var(--color-muted)]"
                      }`}
                    >
                      <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-bold text-[var(--color-text)]">{contact.name}</p>
                      <p className="text-sm text-[var(--color-muted)]">{contact.place}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-[var(--color-card)] px-2 py-1 text-xs font-bold text-[var(--color-muted)]">
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
