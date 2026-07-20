import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const THROTTLE_MS = 5000;
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 5000,
  timeout: 10000
};

const toLocationPayload = (position, userId, groupId) => {
  const timestamp = new Date(position.timestamp || Date.now()).toISOString();

  return {
    userId,
    groupId,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    heading: position.coords.heading,
    speed: position.coords.speed,
    sharing: true,
    simulated: false,
    timestamp,
    updatedAt: timestamp
  };
};

export const useLiveLocation = ({ groupId = null, onSharingChange } = {}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [status, setStatus] = useState("demo");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState("");
  const [lastSentAt, setLastSentAt] = useState(null);
  const [sending, setSending] = useState(false);
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

  const logGpsIssue = useCallback(
    (type, message) => {
      if (!user) return;
      api
        .post("/activity", {
          type,
          priority: "warning",
          message,
          userId: user.id,
          userName: user.fullName,
          userEmail: user.email,
          userPhone: user.phone,
          sector: "GPS"
        })
        .catch(() => undefined);
    },
    [user]
  );

  const ensureSharingStarted = useCallback(async () => {
    if (startedOnServerRef.current) return;

    if (!startPromiseRef.current) {
      startPromiseRef.current = api.post("/location/share/start");
    }

    try {
      await startPromiseRef.current;
      startPromiseRef.current = null;
      startedOnServerRef.current = true;
      onSharingChange?.(true);
    } catch (error) {
      startPromiseRef.current = null;
      startedOnServerRef.current = false;
      throw error;
    }
  }, [onSharingChange]);

  const sendPosition = useCallback(
    async (position, { force = false } = {}) => {
      if (!user) return null;

      const now = Date.now();
      const payload = toLocationPayload(position, user.id, groupId);
      setCurrentLocation(payload);

      if (!force && now - lastSentRef.current < THROTTLE_MS) {
        return payload;
      }

      setSending(true);
      await ensureSharingStarted();
      await api.post("/location/update", payload);
      lastSentRef.current = now;
      setLastSentAt(new Date(now));
      setStatus("active");
      setError("");
      setSending(false);
      return payload;
    },
    [ensureSharingStarted, groupId, user]
  );

  const stopTracking = useCallback(async () => {
    clearBrowserWatch();
    lastSentRef.current = 0;

    try {
      await api.post("/location/share/stop");
    } catch (requestError) {
      setError(requestError.response?.data?.message || t("gps.error.pause"));
    } finally {
      setSending(false);
      startedOnServerRef.current = false;
      startPromiseRef.current = null;
      setStatus("paused");
      onSharingChange?.(false);
    }
  }, [clearBrowserWatch, onSharingChange, t]);

  const handlePositionError = useCallback(
    (positionError) => {
      clearBrowserWatch();
      setSending(false);
      startedOnServerRef.current = false;
      startPromiseRef.current = null;

      const denied = positionError.code === 1;
      const messageKey = denied
        ? "gps.error.denied"
        : positionError.code === 3
          ? "gps.error.timeout"
          : "gps.error.unavailable";
      const message = t(messageKey);

      setStatus(denied ? "denied" : "sending-error");
      setError(message);
      logGpsIssue(denied ? "gps_denied" : "gps_error", message);
    },
    [clearBrowserWatch, logGpsIssue, t]
  );

  const handlePosition = useCallback(
    async (position, options) => {
      try {
        await sendPosition(position, options);
      } catch (requestError) {
        clearBrowserWatch();
        setSending(false);
        lastSentRef.current = 0;
        if (startedOnServerRef.current) {
          await api.post("/location/share/stop").catch(() => undefined);
          startedOnServerRef.current = false;
          startPromiseRef.current = null;
          onSharingChange?.(false);
        }
        const message = requestError.response?.data?.message || t("gps.error.store");
        setStatus("sending-error");
        setError(message);
        logGpsIssue("gps_error", message);
      }
    },
    [clearBrowserWatch, logGpsIssue, onSharingChange, sendPosition, t]
  );

  const refreshNow = useCallback(() => {
    setError("");

    if (!navigator.geolocation) {
      const message = t("gps.error.unsupported");
      setStatus("unsupported");
      setError(message);
      logGpsIssue("gps_error", message);
      return;
    }

    setStatus("permission-pending");
    navigator.geolocation.getCurrentPosition(
      (position) => handlePosition(position, { force: true }),
      handlePositionError,
      GEOLOCATION_OPTIONS
    );
  }, [handlePosition, handlePositionError, logGpsIssue, t]);

  const startTracking = useCallback(() => {
    setError("");

    if (!navigator.geolocation) {
      const message = t("gps.error.unsupported");
      setStatus("unsupported");
      setError(message);
      logGpsIssue("gps_error", message);
      return;
    }

    if (watchIdRef.current != null) return;
    setStatus("permission-pending");
    refreshNow();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => handlePosition(position),
      handlePositionError,
      GEOLOCATION_OPTIONS
    );
  }, [handlePosition, handlePositionError, logGpsIssue, refreshNow, t]);

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
    isTracking: status === "active" || status === "permission-pending",
    lastSentAt,
    refreshNow,
    sending,
    startTracking,
    status,
    stopTracking
  };
};
