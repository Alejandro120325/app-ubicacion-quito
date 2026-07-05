import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, UsersRound } from "lucide-react";
import AddMemberModal from "../../components/AddMemberModal.jsx";
import Button from "../../components/Button.jsx";
import CreateGroupModal from "../../components/CreateGroupModal.jsx";
import GroupCard from "../../components/GroupCard.jsx";
import GroupMapPanel from "../../components/GroupMapPanel.jsx";
import GroupMemberCard from "../../components/GroupMemberCard.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useGroupLocations } from "../../hooks/useGroupLocations.js";
import { usePersonaWorkspace } from "../../hooks/usePersonaWorkspace.js";

const PersonaGroups = () => {
  const { t } = useLanguage();
  const {
    error,
    groupMessage,
    groups,
    handleAddMember,
    handleCreateGroup,
    loading,
    selectedGroup,
    selectedMember,
    setSelectedGroup,
    setSelectedMember
  } = usePersonaWorkspace();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [groupForMember, setGroupForMember] = useState(null);
  const { error: pollingError, lastSync, locations } = useGroupLocations(selectedGroup?.id);
  const displayMembers = (selectedGroup?.members || []).map((member) => {
    const liveLocation = locations.find(
      (item) => item.userId === member.userId || item.fullName === member.fullName
    );
    return liveLocation
      ? {
          ...member,
          locationStatus: liveLocation.locationStatus,
          lastLocation: liveLocation.address || liveLocation.sector || member.lastLocation,
          lastUpdate: liveLocation.updatedAt || member.lastUpdate
        }
      : member;
  });

  const submitGroup = async (payload) => {
    const success = await handleCreateGroup(payload);
    if (success) setCreateGroupOpen(false);
    return success;
  };

  const submitMember = async (groupId, payload) => {
    const success = await handleAddMember(groupId, payload);
    if (success) setAddMemberOpen(false);
    return success;
  };

  const openAddMember = (group) => {
    setGroupForMember(group);
    setAddMemberOpen(true);
  };

  if (loading) {
    return <LoadingScreen message={t("persona.loading")} />;
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
            {t("sidebar.groups")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("groups.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("groups.personaPageText")}
          </p>
        </div>
        <HeaderActions badges={[{ icon: UsersRound, label: t("groups.members", { count: selectedGroup?.members?.length || 0 }) }]}>
          <Button icon={Plus} onClick={() => setCreateGroupOpen(true)}>
            {t("groups.create")}
          </Button>
        </HeaderActions>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}
      {groupMessage ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
          {groupMessage}
        </div>
      ) : null}
      {pollingError ? <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{pollingError}</div> : null}

      <div className="grid items-start gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="grid gap-4">
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
            <p className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-sm text-[var(--color-muted)]">
              {t("groups.empty")}
            </p>
          )}
        </section>

        <section className="grid gap-5">
          <GroupMapPanel
            group={selectedGroup}
            locations={locations}
            polling
            selectedMember={selectedMember}
            variant="group"
          />
          {lastSync ? <p className="text-right text-xs text-[var(--color-muted)]">{t("map.lastSync", { value: lastSync.toLocaleTimeString() })}</p> : null}
          <div className="grid gap-4 md:grid-cols-2">
            {displayMembers.map((member) => (
              <GroupMemberCard key={member.id} member={member} onView={setSelectedMember} />
            ))}
          </div>
        </section>
      </div>

      <CreateGroupModal
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onSubmit={submitGroup}
      />
      <AddMemberModal
        group={groupForMember}
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onSubmit={submitMember}
      />
    </motion.section>
  );
};

export default PersonaGroups;
