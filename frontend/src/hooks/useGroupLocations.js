import { useCallback, useEffect, useState } from "react";
import api from "../api/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export const useGroupLocations = (groupId, interval = 5000) => {
  const { t } = useLanguage();
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(Boolean(groupId));

  const refresh = useCallback(async () => {
    if (!groupId) {
      setLocations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`/location/group/${groupId}`);
      setLocations(data.locations || []);
      setLastSync(new Date());
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || t("gps.error.groupLocations"));
    } finally {
      setLoading(false);
    }
  }, [groupId, t]);

  useEffect(() => {
    refresh();
    if (!groupId) return undefined;

    const timer = window.setInterval(refresh, interval);
    return () => window.clearInterval(timer);
  }, [groupId, interval, refresh]);

  return { error, lastSync, loading, locations, refresh };
};
