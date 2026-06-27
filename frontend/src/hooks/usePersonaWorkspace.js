import { useEffect, useMemo, useState } from "react";
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

  return {
    error,
    groupMessage,
    groups,
    handleAddMember,
    handleCreateGroup,
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
