import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  UserX,
  Wifi,
  Plus,
  UsersRound
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../api/api.js";
import AddMemberModal from "../components/AddMemberModal.jsx";
import CreateGroupModal from "../components/CreateGroupModal.jsx";
import GroupCard from "../components/GroupCard.jsx";
import GroupMapPanel from "../components/GroupMapPanel.jsx";
import GroupMemberCard from "../components/GroupMemberCard.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import SimulatedMap from "../components/SimulatedMap.jsx";
import StatCard from "../components/StatCard.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import UserCard from "../components/UserCard.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const pointPositions = [
  { top: "27%", left: "62%" },
  { top: "45%", left: "76%" },
  { top: "72%", left: "58%" },
  { top: "55%", left: "36%" },
  { top: "61%", left: "48%" }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [people, setPeople] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [groupForMember, setGroupForMember] = useState(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupMessage, setGroupMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [usersResponse, groupsResponse] = await Promise.all([
          api.get("/users"),
          api.get("/groups")
        ]);
        setPeople(usersResponse.data.users || []);
        setSelectedPerson(usersResponse.data.users?.[0] || null);
        setGroups(groupsResponse.data.groups || []);
        setSelectedGroup(groupsResponse.data.groups?.[0] || null);
        setSelectedMember(groupsResponse.data.groups?.[0]?.members?.[0] || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || t("admin.loadError"));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [t]);

  const stats = useMemo(() => {
    const activePeople = people.filter((person) => person.active);
    const inactivePeople = people.filter((person) => !person.active);
    const simulatedAlerts = people.filter((person) => !person.sharingLocation);

    return {
      total: people.length,
      active: activePeople.length,
      inactive: inactivePeople.length,
      groups: groups.length,
      alerts: simulatedAlerts.length
    };
  }, [groups.length, people]);

  const mapPoints = useMemo(
    () =>
      people.map((person, index) => ({
        label: person.lastLocation?.sector || person.fullName,
        active: person.active,
        ...pointPositions[index % pointPositions.length]
      })),
    [people]
  );

  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat(language === "en" ? "en-US" : "es-EC", {
        weekday: "long",
        day: "2-digit",
        month: "long"
      }).format(new Date()),
    [language]
  );

  const handleCreateGroup = async (payload) => {
    try {
      setGroupMessage("");
      const { data } = await api.post("/groups", payload);
      const nextGroups = [...groups, data.group];
      setGroups(nextGroups);
      setSelectedGroup(data.group);
      setSelectedMember(null);
      setCreateGroupOpen(false);
      setGroupMessage(t("groups.createSuccess"));
      return true;
    } catch (requestError) {
      setGroupMessage(
        requestError.response?.data?.message || t("groups.error")
      );
      return false;
    }
  };

  const handleAddMember = async (groupId, payload) => {
    try {
      setGroupMessage("");
      const { data } = await api.post(`/groups/${groupId}/members`, payload);
      const nextGroups = groups.map((group) =>
        group.id === groupId ? data.group : group
      );
      setGroups(nextGroups);
      setSelectedGroup(data.group);
      setSelectedMember(data.member);
      setAddMemberOpen(false);
      setGroupMessage(t("groups.memberSuccess"));
      return true;
    } catch (requestError) {
      setGroupMessage(
        requestError.response?.data?.message || t("groups.error")
      );
      return false;
    }
  };

  const openAddMember = (group) => {
    setGroupForMember(group);
    setAddMemberOpen(true);
  };

  return (
    <motion.section
      className="mx-auto max-w-7xl"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            {t("admin.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("admin.greeting", { name: user.fullName })}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("admin.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {t("admin.simulated")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)]">
            <CalendarDays className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
            {currentDate}
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)]">
            <Wifi className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
            {t("admin.systemActive")}
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

      <div id="alertas" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          detail={t("admin.stats.totalDetail")}
          icon={UsersRound}
          title={t("admin.stats.total")}
          tone="blue"
          value={loading ? "..." : stats.total}
        />
        <StatCard
          detail={t("admin.stats.activeDetail")}
          icon={UserCheck}
          title={t("admin.stats.active")}
          tone="mint"
          value={loading ? "..." : stats.active}
        />
        <StatCard
          detail={t("admin.stats.inactiveDetail")}
          icon={UserX}
          title={t("admin.stats.inactive")}
          tone="slate"
          value={loading ? "..." : stats.inactive}
        />
        <StatCard
          detail={t("admin.stats.groupsDetail")}
          icon={UsersRound}
          title={t("admin.stats.groups")}
          tone="blue"
          value={loading ? "..." : stats.groups}
        />
        <StatCard
          detail={t("admin.stats.alertsDetail")}
          icon={Activity}
          title={t("admin.stats.alerts")}
          tone="amber"
          value={loading ? "..." : stats.alerts}
        />
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingScreen message={t("admin.loading")} />
        </div>
      ) : (
        <>
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
          <section
            id="personas"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">
                  {t("admin.people")}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {t("admin.peopleText")}
                </p>
              </div>
              <span className="rounded-lg bg-[var(--color-soft)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)]">
                {t("admin.profiles", { count: people.length })}
              </span>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {people.map((person) => (
                <UserCard
                  key={person.id}
                  user={person}
                  onView={() => setSelectedPerson(person)}
                />
              ))}
            </div>
          </section>

          <section id="mapa" className="grid gap-6">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[var(--color-text)]">
                  {t("admin.mapTitle")}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {t("admin.mapText")}
                </p>
              </div>
              <SimulatedMap
                dashboard
                lastUpdate={selectedPerson?.lastLocation?.lastUpdate}
                points={mapPoints}
                selectedLabel={selectedPerson?.lastLocation?.sector}
              />
            </div>

            {selectedPerson ? (
              <motion.article
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                      {t("admin.detail")}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[var(--color-text)]">
                      {selectedPerson.fullName}
                    </h3>
                  </div>
                  <span
                    className={`rounded-lg px-3 py-2 text-xs font-bold ${
                      selectedPerson.active
                        ? "bg-green-50 text-green-700"
                        : "bg-[var(--color-soft)] text-[var(--color-muted)]"
                    }`}
                  >
                    {selectedPerson.active ? t("common.active") : t("common.inactive")}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-[var(--color-soft)] p-3">
                    <dt className="flex items-center gap-2 text-[var(--color-muted)]">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {t("admin.email")}
                    </dt>
                    <dd className="mt-1 break-words font-semibold text-[var(--color-text)]">
                      {selectedPerson.email}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-[var(--color-soft)] p-3">
                    <dt className="flex items-center gap-2 text-[var(--color-muted)]">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {t("admin.phone")}
                    </dt>
                    <dd className="mt-1 font-semibold text-[var(--color-text)]">
                      {selectedPerson.phone}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-[var(--color-soft)] p-3">
                    <dt className="flex items-center gap-2 text-[var(--color-muted)]">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {t("admin.lastLocation")}
                    </dt>
                    <dd className="mt-1 font-semibold text-[var(--color-text)]">
                      {selectedPerson.lastLocation?.sector || t("admin.noData")} - Quito
                    </dd>
                  </div>
                  <div className="rounded-lg bg-[var(--color-soft)] p-3">
                    <dt className="flex items-center gap-2 text-[var(--color-muted)]">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {t("admin.lastConnection")}
                    </dt>
                    <dd className="mt-1 font-semibold text-[var(--color-text)]">
                      {selectedPerson.lastConnection}
                    </dd>
                  </div>
                </dl>
              </motion.article>
            ) : null}
          </section>
        </div>
        <section
          id="grupos"
          className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                {t("sidebar.groups")}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
                {t("groups.title")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
                {t("groups.subtitle")}
              </p>
            </div>
            <Button icon={Plus} onClick={() => setCreateGroupOpen(true)}>
              {t("groups.create")}
            </Button>
          </div>

          {groupMessage ? (
            <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
              {groupMessage}
            </div>
          ) : null}

          <div className="mt-5 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="grid gap-4">
              {groups.length ? (
                groups.map((group) => (
                  <GroupCard
                    active={selectedGroup?.id === group.id}
                    group={group}
                    key={group.id}
                    onAddMember={openAddMember}
                    onSelect={(nextGroup) => {
                      setSelectedGroup(nextGroup);
                      setSelectedMember(nextGroup.members?.[0] || null);
                    }}
                  />
                ))
              ) : (
                <p className="rounded-lg bg-[var(--color-soft)] p-4 text-sm text-[var(--color-muted)]">
                  {t("groups.empty")}
                </p>
              )}
            </div>

            <div className="grid gap-4">
              <GroupMapPanel group={selectedGroup} selectedMember={selectedMember} />
              <div className="grid gap-4 md:grid-cols-2">
                {(selectedGroup?.members || []).map((member) => (
                  <GroupMemberCard
                    key={member.id}
                    member={member}
                    onView={setSelectedMember}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <CreateGroupModal
          open={createGroupOpen}
          onClose={() => setCreateGroupOpen(false)}
          onSubmit={handleCreateGroup}
        />
        <AddMemberModal
          group={groupForMember}
          open={addMemberOpen}
          onClose={() => setAddMemberOpen(false)}
          onSubmit={handleAddMember}
        />
        </>
      )}
    </motion.section>
  );
};

export default AdminDashboard;
