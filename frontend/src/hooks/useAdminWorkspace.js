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

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const [usersResponse, groupsResponse] = await Promise.all([
          api.get("/users"),
          api.get("/groups")
        ]);
        const nextPeople = usersResponse.data.users || [];
        const nextGroups = groupsResponse.data.groups || [];

        setPeople(nextPeople);
        setGroups(nextGroups);
        setSelectedPerson(nextPeople[0] || null);
        setSelectedGroup(nextGroups[0] || null);
        setSelectedMember(nextGroups[0]?.members?.[0] || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || t("admin.loadError"));
      } finally {
        setLoading(false);
      }
    };

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

  return {
    alerts,
    error,
    groupMessage,
    groups,
    handleAddMember,
    handleCreateGroup,
    loading,
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
