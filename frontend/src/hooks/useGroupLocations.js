import { useCallback, useEffect, useState } from "react";
import api from "../api/api.js";

export const useGroupLocations = (groupId, interval = 5000) => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState(null);

  const refresh = useCallback(async () => {
    if (!groupId) {
      setLocations([]);
      return;
    }

    try {
      const { data } = await api.get(`/location/group/${groupId}`);
      setLocations(data.locations || []);
      setLastSync(new Date());
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudieron actualizar las ubicaciones.");
    }
  }, [groupId]);

  useEffect(() => {
    refresh();
    if (!groupId) return undefined;

    const timer = window.setInterval(refresh, interval);
    return () => window.clearInterval(timer);
  }, [groupId, interval, refresh]);

  return { error, lastSync, locations, refresh };
};
