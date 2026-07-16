import { useEffect, useMemo, useState } from "react";
import api from "../api/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const pointPositions = [
  { top: "27%", left: "62%" },
  { top: "45%", left: "76%" },
  { top: "72%", left: "58%" },
  { top: "55%", left: "36%" },
  { top: "61%", left: "48%" }
];

const getPersonStatus = (person) => {
  if (person.sharingLocation) return "sharing";
  if (person.active) return "paused";
  return "offline";
};

export const useAdminWorkspace = () => {
  const { t } = useLanguage();
  const [people, setPeople] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupMessage, setGroupMessage] = useState("");

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      const [usersResponse, groupsResponse] = await Promise.all([
        api.get("/users"),
        api.get("/groups")
      ]);
      const nextPeople = usersResponse.data.users || [];
      const nextGroups = groupsResponse.data.groups || [];

      setPeople(nextPeople);
      setGroups(nextGroups);
      setSelectedPerson((current) =>
        current ? nextPeople.find((person) => person.id === current.id) || nextPeople[0] || null : nextPeople[0] || null
      );
      setSelectedGroup((current) =>
        current ? nextGroups.find((group) => group.id === current.id) || nextGroups[0] || null : nextGroups[0] || null
      );
      setSelectedMember((current) =>
        current ? current : nextGroups[0]?.members?.[0] || null
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || t("admin.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [t]);

  const stats = useMemo(() => {
    const personas = people.filter((person) => person.role === "persona");
    const activePeople = personas.filter((person) => person.sharingLocation);
    const inactivePeople = personas.filter((person) => !person.sharingLocation);

    return {
      total: personas.length,
      active: activePeople.length,
      inactive: inactivePeople.length,
      groups: groups.length,
      alerts: inactivePeople.length
    };
  }, [groups.length, people]);

  const mapPoints = useMemo(
    () =>
      people
        .filter((person) => person.role === "persona")
        .map((person, index) => ({
          label: person.lastLocation?.sector || person.fullName,
          fullName: person.fullName,
          locationStatus: getPersonStatus(person),
          ...pointPositions[index % pointPositions.length]
        })),
    [people]
  );

  const alerts = useMemo(
    () =>
      people
        .filter((person) => person.role === "persona")
        .map((person, index) => ({
          id: person.id,
          title: person.sharingLocation
            ? t("alerts.types.active")
            : person.active
              ? t("alerts.types.paused")
              : t("alerts.types.offline"),
          person: person.fullName,
          status: person.sharingLocation ? t("alerts.status.resolved") : t("alerts.status.review"),
          type: person.sharingLocation ? "info" : person.active ? "warning" : "critical",
          date: person.lastConnection || `2026-06-21 1${index}:30`,
          description: person.sharingLocation
            ? t("alerts.descriptions.active")
            : t("alerts.descriptions.paused")
        })),
    [people, t]
  );

  const handleCreateGroup = async (payload) => {
    try {
      setGroupMessage("");
      const { data } = await api.post("/groups", payload);
      const nextGroups = [...groups, data.group];
      setGroups(nextGroups);
      setSelectedGroup(data.group);
      setSelectedMember(null);
      setGroupMessage(t("groups.createSuccess"));
      return true;
    } catch (requestError) {
      setGroupMessage(requestError.response?.data?.message || t("groups.error"));
      return false;
    }
  };

  const handleUpdateGroup = async (groupId, payload) => {
    try {
      setGroupMessage("");
      const { data } = await api.patch(`/groups/${groupId}`, payload);
      const nextGroups = groups.map((group) =>
        group.id === groupId ? data.group : group
      );
      setGroups(nextGroups);
      setSelectedGroup(data.group);
      setGroupMessage("Grupo actualizado correctamente.");
      return true;
    } catch (requestError) {
      setGroupMessage(requestError.response?.data?.message || "No se pudo actualizar el grupo.");
      return false;
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      setGroupMessage("");
      await api.delete(`/groups/${groupId}`);
      const nextGroups = groups.filter((group) => group.id !== groupId);
      setGroups(nextGroups);
      setSelectedGroup(nextGroups[0] || null);
      setSelectedMember(nextGroups[0]?.members?.[0] || null);
      setGroupMessage("Grupo eliminado correctamente.");
      return true;
    } catch (requestError) {
      setGroupMessage(requestError.response?.data?.message || "No se pudo eliminar el grupo.");
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
      setGroupMessage(t("groups.memberSuccess"));
      return true;
    } catch (requestError) {
      setGroupMessage(requestError.response?.data?.message || t("groups.error"));
      return false;
    }
  };

  const handleUpdateMember = async (groupId, memberId, payload) => {
    try {
      setGroupMessage("");
      const { data } = await api.patch(`/groups/${groupId}/members/${memberId}`, payload);
      const nextGroups = groups.map((group) =>
        group.id === groupId ? data.group : group
      );
      setGroups(nextGroups);
      setSelectedGroup(data.group);
      setSelectedMember(data.member);
      setGroupMessage("Integrante actualizado correctamente.");
      return true;
    } catch (requestError) {
      setGroupMessage(requestError.response?.data?.message || "No se pudo actualizar el integrante.");
      return false;
    }
  };

  const handleDeleteMember = async (groupId, memberId) => {
    try {
      setGroupMessage("");
      const { data } = await api.delete(`/groups/${groupId}/members/${memberId}`);
      const nextGroups = groups.map((group) =>
        group.id === groupId ? data.group : group
      );
      setGroups(nextGroups);
      setSelectedGroup(data.group);
      setSelectedMember(data.group?.members?.[0] || null);
      setGroupMessage("Integrante quitado correctamente.");
      return true;
    } catch (requestError) {
      setGroupMessage(requestError.response?.data?.message || "No se pudo quitar el integrante.");
      return false;
    }
  };

  return {
    alerts,
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
    loadWorkspace,
    mapPoints,
    people,
    selectedGroup,
    selectedMember,
    selectedPerson,
    setGroupMessage,
    setSelectedGroup,
    setSelectedMember,
    setSelectedPerson,
    stats
  };
};
