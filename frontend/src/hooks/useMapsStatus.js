import { useEffect, useState } from "react";
import { mapsApi } from "../api/mapsApi.js";

export const useMapsStatus = () => {
  const [status, setStatus] = useState({ configured: false, mode: "checking" });

  useEffect(() => {
    let active = true;
    mapsApi
      .getStatus()
      .then((payload) => active && setStatus(payload))
      .catch(() => active && setStatus({ configured: false, mode: "unavailable" }));

    return () => {
      active = false;
    };
  }, []);

  return status;
};
