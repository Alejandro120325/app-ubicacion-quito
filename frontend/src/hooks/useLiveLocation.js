import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const THROTTLE_MS = 5000;

const toLocation = (position) => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  accuracy: position.coords.accuracy,
  heading: position.coords.heading,
  speed: position.coords.speed,
  updatedAt: new Date(position.timestamp).toISOString(),
  simulated: false,
  sharing: true
});

export const useLiveLocation = ({ groupId = null, onSharingChange } = {}) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState("idle");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState("");
  const [lastSentAt, setLastSentAt] = useState(null);
  const watchIdRef = useRef(null);
  const lastSentRef = useRef(0);
  const startPromiseRef = useRef(null);
  const startedOnServerRef = useRef(false);

  const clearBrowserWatch = useCallback(() => {
    if (watchIdRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const stopTracking = useCallback(async () => {
    clearBrowserWatch();
    lastSentRef.current = 0;
    try {
      await api.post("/location/share/stop");
    } catch (requestError) {
      setError(requestError.response?.data?.message || t("gps.error.pause"));
    } finally {
      startedOnServerRef.current = false;
      startPromiseRef.current = null;
      setStatus("paused");
      onSharingChange?.(false);
    }
  }, [clearBrowserWatch, onSharingChange, t]);

  const startTracking = useCallback(() => {
    setError("");

    if (!navigator.geolocation) {
      setStatus("unsupported");
      setError(t("gps.error.unsupported"));
      return;
    }

    if (watchIdRef.current != null) return;
    setStatus("requesting");

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const nextLocation = toLocation(position);
        setCurrentLocation(nextLocation);

        try {
          if (!startedOnServerRef.current) {
            if (!startPromiseRef.current) {
              startPromiseRef.current = api.post("/location/share/start");
            }
            try {
              await startPromiseRef.current;
              startedOnServerRef.current = true;
              startPromiseRef.current = null;
            } catch (startError) {
              startedOnServerRef.current = false;
              startPromiseRef.current = null;
              throw startError;
            }
            onSharingChange?.(true);
          }

          const now = Date.now();
          if (now - lastSentRef.current >= THROTTLE_MS) {
            lastSentRef.current = now;
            await api.post("/location/update", {
              ...nextLocation,
              groupId
            });
            setLastSentAt(new Date(now));
          }

          setStatus("sharing");
          setError("");
        } catch (requestError) {
          clearBrowserWatch();
          lastSentRef.current = 0;
          if (startedOnServerRef.current) {
            await api.post("/location/share/stop").catch(() => undefined);
            startedOnServerRef.current = false;
            startPromiseRef.current = null;
            onSharingChange?.(false);
          }
          setStatus("error");
          setError(requestError.response?.data?.message || t("gps.error.store"));
        }
      },
      (positionError) => {
        clearBrowserWatch();
        setStatus(positionError.code === 1 ? "denied" : "error");
        const messageKey =
          positionError.code === 1
            ? "gps.error.denied"
            : positionError.code === 3
              ? "gps.error.timeout"
              : "gps.error.unavailable";
        setError(t(messageKey));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );
  }, [clearBrowserWatch, groupId, onSharingChange, t]);

  useEffect(
    () => () => {
      clearBrowserWatch();
      if (startedOnServerRef.current) {
        api.post("/location/share/stop").catch(() => undefined);
      }
    },
    [clearBrowserWatch]
  );

  return {
    currentLocation,
    error,
    isTracking: status === "sharing" || status === "requesting",
    lastSentAt,
    startTracking,
    status,
    stopTracking
  };
};
