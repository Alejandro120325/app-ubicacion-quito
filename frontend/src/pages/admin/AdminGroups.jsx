import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Plus, Trash2, UsersRound } from "lucide-react";
import AddMemberModal from "../../components/AddMemberModal.jsx";
import Button from "../../components/Button.jsx";
import CreateGroupModal from "../../components/CreateGroupModal.jsx";
import EditGroupModal from "../../components/EditGroupModal.jsx";
import EditMemberModal from "../../components/EditMemberModal.jsx";
import GroupCard from "../../components/GroupCard.jsx";
import GroupMapPanel from "../../components/GroupMapPanel.jsx";
import GroupMemberCard from "../../components/GroupMemberCard.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useGroupLocations } from "../../hooks/useGroupLocations.js";
import { useAdminWorkspace } from "../../hooks/useAdminWorkspace.js";

const AdminGroups = () => {
  const { t } = useLanguage();
  const {
    error,
    groupMessage,
    groups,
    handleAddMember,
    handleCreateGroup,
    handleDeleteGroup,
    handleDeleteMember,
    handleUpdateGroup,
    handleUpdateMember,
    loading,
    selectedGroup,
    selectedMember,
    setSelectedGroup,
    setSelectedMember
  } = useAdminWorkspace();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [groupForMember, setGroupForMember] = useState(null);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [groupForEdit, setGroupForEdit] = useState(null);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [memberForEdit, setMemberForEdit] = useState(null);
  const { error: pollingError, locations } = useGroupLocations(selectedGroup?.id);
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

  const openEditGroup = (group) => {
    setGroupForEdit(group);
    setEditGroupOpen(true);
  };

  const confirmDeleteGroup = async (group) => {
    const confirmed = window.confirm(`Eliminar el grupo "${group.name}"? Esta accion no elimina usuarios globales.`);
    if (confirmed) await handleDeleteGroup(group.id);
  };

  const openEditMember = (member) => {
    setMemberForEdit(member);
    setEditMemberOpen(true);
  };

  const confirmDeleteMember = async (member) => {
    if (!selectedGroup) return;
    const confirmed = window.confirm(`Quitar a "${member.fullName}" del grupo "${selectedGroup.name}"?`);
    if (confirmed) await handleDeleteMember(selectedGroup.id, member.id);
  };

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
            {t("sidebar.groups")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("groups.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("groups.adminPageText")}
          </p>
        </div>
        <HeaderActions badges={[{ icon: UsersRound, label: t("admin.stats.groupsDetail") }]}>
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
                onDelete={confirmDeleteGroup}
                onEdit={openEditGroup}
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
          <GroupMapPanel group={selectedGroup} locations={locations} polling selectedMember={selectedMember} variant="group" />
          <div className="grid gap-4 md:grid-cols-2">
            {displayMembers.map((member) => (
              <div className="grid gap-2" key={member.id}>
                <GroupMemberCard member={member} onView={setSelectedMember} />
                <div className="grid grid-cols-2 gap-2">
                  <Button icon={Edit3} size="sm" variant="secondary" onClick={() => openEditMember(member)}>
                    Editar
                  </Button>
                  <Button icon={Trash2} size="sm" variant="danger" onClick={() => confirmDeleteMember(member)}>
                    Quitar
                  </Button>
                </div>
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
      <EditGroupModal
        group={groupForEdit}
        open={editGroupOpen}
        onClose={() => setEditGroupOpen(false)}
        onSubmit={handleUpdateGroup}
      />
      <EditMemberModal
        group={selectedGroup}
        member={memberForEdit}
        open={editMemberOpen}
        onClose={() => setEditMemberOpen(false)}
        onSubmit={handleUpdateMember}
      />
    </motion.section>
  );
};

export default AdminGroups;
