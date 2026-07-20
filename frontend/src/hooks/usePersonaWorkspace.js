import { useEffect, useMemo, useState } from "react";
import { leaveGroup, removeGroupMember } from "../api/groupMembersApi.js";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export const usePersonaWorkspace = () => {
  const { updateUser, user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(user);
  const [location, setLocation] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [sharing, setSharing] = useState(Boolean(user?.sharingLocation));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [groupMessage, setGroupMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [meResponse, locationResponse, groupsResponse] = await Promise.all([
          api.get("/users/me"),
          api.get(`/location/${user.id}`),
          api.get("/groups")
        ]);

        setProfile(meResponse.data.user);
        setSharing(Boolean(meResponse.data.user.sharingLocation));
        setLocation(locationResponse.data.location);
        setGroups(groupsResponse.data.groups || []);
        setSelectedGroup(groupsResponse.data.groups?.[0] || null);
        setSelectedMember(groupsResponse.data.groups?.[0]?.members?.[0] || null);
        updateUser(meResponse.data.user);
      } catch (requestError) {
        setError(requestError.response?.data?.message || t("persona.loadError"));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [t, user.id]);

  const locationPoints = useMemo(
    () => [
      {
        label: location?.sector || t("persona.noSector"),
        locationStatus: sharing ? "sharing" : "paused",
        top: "38%",
        left: "58%"
      }
    ],
    [location?.sector, sharing, t]
  );

  const handleToggleSharing = async () => {
    try {
      setSaving(true);
      setError("");
      const nextSharing = !sharing;
      const { data } = await api.patch("/location/share", {
        sharing: nextSharing
      });

      await api.post("/activity", {
        type: nextSharing ? "location_shared" : "disconnection",
        priority: nextSharing ? "info" : "high",
        message: nextSharing
          ? `${user.fullName} activo compartir ubicacion.`
          : `${user.fullName} pauso compartir ubicacion.`,
        userId: user.id,
        userName: user.fullName,
        sector: location?.sector || "Quito"
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

  const handleDeleteMember = async (groupId, memberId) => {
    try {
      setGroupMessage("");
      const data = await removeGroupMember(groupId, memberId);
      const nextGroups = groups.map((group) =>
        group.id === groupId ? data.group : group
      );
      setGroups(nextGroups);
      setSelectedGroup(data.group);
      setSelectedMember(data.group?.members?.[0] || null);
      setGroupMessage(data.message || "Integrante eliminado correctamente.");
      return true;
    } catch (requestError) {
      setGroupMessage(requestError.response?.data?.message || "No se pudo eliminar el integrante.");
      return false;
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      setGroupMessage("");
      const data = await leaveGroup(groupId);
      const nextGroups = groups.filter((group) => group.id !== groupId);
      setGroups(nextGroups);
      setSelectedGroup(nextGroups[0] || null);
      setSelectedMember(nextGroups[0]?.members?.[0] || null);
      setGroupMessage(data.message || "Saliste del grupo correctamente.");
      return true;
    } catch (requestError) {
      setGroupMessage(requestError.response?.data?.message || "No se pudo salir del grupo.");
      return false;
    }
  };

  return {
    error,
    groupMessage,
    groups,
    handleAddMember,
    handleCreateGroup,
    handleDeleteMember,
    handleLeaveGroup,
    handleToggleSharing,
    loading,
    location,
    locationPoints,
    profile,
    saving,
    selectedGroup,
    selectedMember,
    setGroupMessage,
    setSelectedGroup,
    setSelectedMember,
    sharing
  };
};
