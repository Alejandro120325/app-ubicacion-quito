import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, UsersRound } from "lucide-react";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SimulatedMap from "../../components/SimulatedMap.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAdminWorkspace } from "../../hooks/useAdminWorkspace.js";

const getStatus = (person) => {
  if (person.sharingLocation) return "sharing";
  if (person.active) return "paused";
  return "offline";
};

const AdminMap = () => {
  const { t } = useLanguage();
  const { error, loading, mapPoints, people, selectedPerson, setSelectedPerson } =
    useAdminWorkspace();

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
            {t("sidebar.map")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("admin.mapTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("admin.mapPageText")}
          </p>
        </div>
        <HeaderActions badges={[{ icon: Navigation, label: t("map.title") }]} />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-soft">
          <SimulatedMap
            mainLabel="Quito"
            points={mapPoints}
            selectedLabel={selectedPerson?.lastLocation?.sector}
            showConnections
            variant="large"
          />
        </section>

        <aside className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm xl:sticky xl:top-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                {t("admin.mapPeople")}
              </p>
              <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">
                {t("sidebar.people")}
              </h2>
            </div>
            <span className="rounded-lg bg-[var(--color-soft)] p-3 text-[var(--color-primary)]">
              <UsersRound className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          <div className="grid gap-3">
            {people.map((person) => (
              <button
                className={`rounded-lg border p-4 text-left transition focus-ring ${
                  selectedPerson?.id === person.id
                    ? "border-[var(--color-primary)] bg-[var(--color-soft)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-soft)]"
                }`}
                key={person.id}
                type="button"
                onClick={() => setSelectedPerson(person)}
              >
                <p className="font-bold text-[var(--color-text)]">{person.fullName}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <MapPin className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                  {person.lastLocation?.sector || t("admin.noData")} - Quito
                </p>
                <span className="mt-3 inline-flex rounded-lg bg-[var(--color-soft)] px-2 py-1 text-xs font-bold text-[var(--color-muted)]">
                  {t(`groups.status.${getStatus(person)}`)}
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </motion.section>
  );
};

export default AdminMap;
