import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Mail, MapPin, Phone, Search, UsersRound } from "lucide-react";
import HeaderActions from "../../components/HeaderActions.jsx";
import InputField from "../../components/InputField.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import UserCard from "../../components/UserCard.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAdminWorkspace } from "../../hooks/useAdminWorkspace.js";

const filters = ["all", "sharing", "paused", "offline"];

const getStatus = (person) => {
  if (person.sharingLocation) return "sharing";
  if (person.active) return "paused";
  return "offline";
};

const getLocationLabel = (location, fallback) =>
  location?.address || location?.sector || fallback;

const AdminPeople = () => {
  const { t } = useLanguage();
  const { error, loading, people, selectedPerson, setSelectedPerson } = useAdminWorkspace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredPeople = useMemo(
    () =>
      people.filter((person) => {
        const text = `${person.fullName} ${person.email} ${person.phone}`.toLowerCase();
        const matchesQuery = text.includes(query.trim().toLowerCase());
        const matchesFilter = filter === "all" || getStatus(person) === filter;
        return matchesQuery && matchesFilter;
      }),
    [filter, people, query]
  );

  if (loading) {
    return <LoadingScreen message={t("admin.loading")} />;
  }

  return (
    <motion.section
      className="mx-auto grid max-w-7xl gap-8"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            {t("sidebar.people")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("admin.people")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("admin.peoplePageText")}
          </p>
        </div>
        <HeaderActions badges={[{ icon: UsersRound, label: t("admin.profiles", { count: people.length }) }]} />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <SectionHelp
        storageKey="geokipu_guide_people_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes revisar las personas registradas y su informacion principal."
        bullets={[
          "Consulta nombre, correo, telefono y estado.",
          "Revisa detalles de cada persona.",
          "Usa esta informacion para contactar miembros de confianza."
        ]}
      />

      <section className="glass-card p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <InputField
            icon={Search}
            label={t("common.search")}
            name="query"
            placeholder={t("admin.peopleSearch")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((status) => (
              <button
                className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition focus-ring ${
                  filter === status
                    ? "border-[var(--color-primary)] bg-[var(--color-soft)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)] hover:bg-[var(--color-soft)]"
                }`}
                key={status}
                type="button"
                onClick={() => setFilter(status)}
              >
                {status === "all" ? t("common.all") : t(`groups.status.${status}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="grid gap-4 sm:grid-cols-2">
          {filteredPeople.map((person) => (
            <UserCard
              key={person.id}
              user={person}
              onView={() => setSelectedPerson(person)}
            />
          ))}
        </section>

        <aside className="glass-card p-6 xl:sticky xl:top-8">
          {selectedPerson ? (
            <>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                {t("admin.detail")}
              </p>
              <div className="mt-3 flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">
                  {selectedPerson.fullName}
                </h2>
                <span className="rounded-lg bg-[var(--color-soft)] px-3 py-2 text-xs font-bold text-[var(--color-muted)]">
                  {t(`groups.status.${getStatus(selectedPerson)}`)}
                </span>
              </div>

              <dl className="mt-6 grid gap-3 text-sm">
                {[
                  { icon: Mail, label: t("admin.email"), value: selectedPerson.email },
                  { icon: Phone, label: t("admin.phone"), value: selectedPerson.phone },
                  {
                    icon: MapPin,
                    label: t("admin.lastLocation"),
                    value: getLocationLabel(selectedPerson.lastLocation, t("admin.noData"))
                  },
                  {
                    icon: MapPin,
                    label: "Tipo de ubicacion",
                    value:
                      selectedPerson.lastLocation?.simulated === false
                        ? `GPS real${selectedPerson.lastLocation?.accuracy != null ? ` - precision ${Math.round(selectedPerson.lastLocation.accuracy)} m` : ""}`
                        : "Modo demostracion"
                  },
                  {
                    icon: MapPin,
                    label: "Sector",
                    value: selectedPerson.lastLocation?.sector || t("admin.noData")
                  },
                  { icon: Clock3, label: t("admin.lastConnection"), value: selectedPerson.lastConnection }
                ].map((item) => (
                  <div
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4"
                    key={item.label}
                  >
                    <dt className="flex items-center gap-2 text-[var(--color-muted)]">
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </dt>
                    <dd className="mt-2 break-words font-bold text-[var(--color-text)]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">{t("admin.noData")}</p>
          )}
        </aside>
      </div>
    </motion.section>
  );
};

export default AdminPeople;
