import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, UsersRound } from "lucide-react";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import SimulatedMap from "../../components/SimulatedMap.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAdminWorkspace } from "../../hooks/useAdminWorkspace.js";
import { useGroupLocations } from "../../hooks/useGroupLocations.js";

const getStatus = (person) => {
  if (person.sharingLocation) return "sharing";
  if (person.active) return "paused";
  return "offline";
};

const AdminMap = () => {
  const { t } = useLanguage();
  const {
    error,
    groups,
    loading,
    mapPoints,
    people,
    selectedGroup,
    selectedPerson,
    setSelectedGroup,
    setSelectedPerson
  } = useAdminWorkspace();
  const { error: pollingError, locations } = useGroupLocations(selectedGroup?.id);
  const visiblePeople = selectedGroup
    ? people.filter((person) =>
        selectedGroup.members?.some(
          (member) => member.userId === person.id || member.email === person.email
        )
      )
    : people;

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
      {pollingError ? <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{pollingError}</div> : null}

      <SectionHelp
        storageKey="geokipu_guide_map_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes visualizar la ubicacion compartida o el modo demostracion de GeoKipu."
        bullets={[
          "Revisa la ultima ubicacion disponible.",
          "Identifica sectores importantes en el mapa.",
          "Activa o pausa el seguimiento con consentimiento."
        ]}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="glass-card min-w-0 p-4 sm:p-5">
          <SimulatedMap
            locations={locations}
            mainLabel="Quito"
            points={mapPoints}
            polling
            selectedGroup={selectedGroup}
            selectedLabel={selectedPerson?.fullName || selectedPerson?.lastLocation?.sector}
            showConnections
            variant="large"
          />
        </section>

        <aside className="glass-card p-5 xl:sticky xl:top-8">
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

          <label className="mb-4 block">
            <span className="mb-2 block text-xs font-bold uppercase text-[var(--color-muted)]">
              {t("groups.groupLabel")}
            </span>
            <select
              className="glass-input h-12 w-full rounded-lg border px-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-ring)]"
              value={selectedGroup?.id || ""}
              onChange={(event) => {
                const group = groups.find((item) => item.id === Number(event.target.value));
                setSelectedGroup(group || null);
                const firstMember = group?.members?.[0];
                setSelectedPerson(
                  people.find(
                    (person) => person.id === firstMember?.userId || person.email === firstMember?.email
                  ) || null
                );
              }}
            >
              {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
          </label>

          <div className="grid gap-3">
            {visiblePeople.map((person) => (
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
