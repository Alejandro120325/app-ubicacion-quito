import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Plus, Trash2, UsersRound } from "lucide-react";
import AddMemberModal from "../../components/AddMemberModal.jsx";
import Button from "../../components/Button.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import CreateGroupModal from "../../components/CreateGroupModal.jsx";
import GroupCard from "../../components/GroupCard.jsx";
import GroupMapPanel from "../../components/GroupMapPanel.jsx";
import GroupMemberCard from "../../components/GroupMemberCard.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
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
    handleDeleteMember,
    handleLeaveGroup,
    loading,
    profile,
    selectedGroup,
    selectedMember,
    setSelectedGroup,
    setSelectedMember
  } = usePersonaWorkspace();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [groupForMember, setGroupForMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [leaveGroupTarget, setLeaveGroupTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { error: pollingError, lastSync, locations } = useGroupLocations(selectedGroup?.id);
  const isGroupOwner = (group) => Boolean(group && profile?.id === group.createdBy);
  const isOwnMember = (member) =>
    Boolean(profile && (member.userId === profile.id || member.email === profile.email));
  const canManageSelectedGroup = isGroupOwner(selectedGroup);
  const canLeaveSelectedGroup =
    Boolean(selectedGroup) &&
    !canManageSelectedGroup &&
    (selectedGroup?.members || []).some(isOwnMember);
  const displayMembers = (selectedGroup?.members || []).map((member) => {
    const liveLocation = locations.find(
      (item) => item.userId === member.userId || item.fullName === member.fullName
    );
    return liveLocation
      ? {
          ...member,
          accuracy: liveLocation.accuracy,
          address: liveLocation.address,
          locationStatus: liveLocation.locationStatus,
          lastLocation: liveLocation.address || liveLocation.sector || member.lastLocation,
          lastUpdate: liveLocation.updatedAt || member.lastUpdate,
          sector: liveLocation.sector,
          simulated: liveLocation.simulated
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

  const confirmDeleteMember = (member) => setMemberToDelete(member);

  const confirmLeaveGroup = () => {
    if (selectedGroup) setLeaveGroupTarget(selectedGroup);
  };

  const handleConfirmDeleteMember = async () => {
    if (!selectedGroup || !memberToDelete) return;
    setDeleting(true);
    const success = await handleDeleteMember(selectedGroup.id, memberToDelete.id);
    setDeleting(false);
    if (success) setMemberToDelete(null);
  };

  const handleConfirmLeaveGroup = async () => {
    if (!leaveGroupTarget) return;
    setDeleting(true);
    const success = await handleLeaveGroup(leaveGroupTarget.id);
    setDeleting(false);
    if (success) setLeaveGroupTarget(null);
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
          {canLeaveSelectedGroup ? (
            <Button icon={LogOut} variant="secondary" onClick={confirmLeaveGroup}>
              Salir del grupo
            </Button>
          ) : null}
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

      <SectionHelp
        storageKey="geokipu_guide_groups_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes organizar tus circulos de confianza y administrar integrantes."
        bullets={[
          "Crea, edita o elimina grupos.",
          "Agrega o quita integrantes.",
          "Revisa que personas pertenecen a cada grupo."
        ]}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="grid gap-4">
          {groups.length ? (
            groups.map((group) => (
              <GroupCard
                active={selectedGroup?.id === group.id}
                group={group}
                key={group.id}
                onAddMember={isGroupOwner(group) ? openAddMember : undefined}
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
              <div className="grid gap-2" key={member.id}>
                <GroupMemberCard member={member} onView={setSelectedMember} />
                {canManageSelectedGroup && member.userId !== selectedGroup?.createdBy ? (
                  <Button icon={Trash2} size="sm" variant="danger" onClick={() => confirmDeleteMember(member)}>
                    Eliminar integrante
                  </Button>
                ) : null}
              </div>
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
      <ConfirmDialog
        confirmLabel="Si, eliminar"
        description={
          selectedGroup && memberToDelete
            ? `Se eliminara a "${memberToDelete.fullName}" del grupo "${selectedGroup.name}".`
            : ""
        }
        loading={deleting}
        open={Boolean(memberToDelete)}
        title="Eliminar integrante"
        onCancel={() => (deleting ? undefined : setMemberToDelete(null))}
        onConfirm={handleConfirmDeleteMember}
      />
      <ConfirmDialog
        confirmLabel="Si, salir"
        description={
          leaveGroupTarget
            ? `Dejaras de ver el grupo "${leaveGroupTarget.name}" y sus integrantes.`
            : ""
        }
        loading={deleting}
        open={Boolean(leaveGroupTarget)}
        title="Salir del grupo"
        onCancel={() => (deleting ? undefined : setLeaveGroupTarget(null))}
        onConfirm={handleConfirmLeaveGroup}
      />
    </motion.section>
  );
};

export default PersonaGroups;
