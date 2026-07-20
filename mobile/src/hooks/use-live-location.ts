import * as ExpoLocation from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@/services/api";
import type { SimulatedLocation, User } from "@/types";

export type LiveLocationStatus =
  | "demo"
  | "permission-pending"
  | "active"
  | "paused"
  | "denied"
  | "sending-error";

type ShareResponse = {
  sharing: boolean;
  user: User;
};

type UpdateLocationResponse = {
  location: SimulatedLocation;
};

type UseLiveLocationOptions = {
  groupId?: number | null;
  reload?: () => Promise<void>;
  setProfile?: (user: User) => void;
  updateUser?: (user: User) => Promise<void>;
  user: User | null;
};

const SEND_THROTTLE_MS = 5000;
const WATCH_OPTIONS = {
  accuracy: ExpoLocation.Accuracy.High,
  distanceInterval: 10,
  timeInterval: 5000
};

const buildPayload = (
  position: ExpoLocation.LocationObject,
  userId: number,
  groupId?: number | null
) => {
  const timestamp = new Date(position.timestamp || Date.now()).toISOString();

  return {
    userId,
    groupId: groupId ?? null,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    heading: position.coords.heading,
    speed: position.coords.speed,
    sharing: true,
    simulated: false,
    timestamp
  };
};

export function useLiveLocation({
  groupId = null,
  reload,
  setProfile,
  updateUser,
  user
}: UseLiveLocationOptions) {
  const [status, setStatus] = useState<LiveLocationStatus>("demo");
  const [liveLocation, setLiveLocation] = useState<SimulatedLocation | null>(null);
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const subscriptionRef = useRef<ExpoLocation.LocationSubscription | null>(null);
  const lastSentRef = useRef(0);
  const sharingStartedRef = useRef(false);

  const stopSubscription = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
  }, []);

  const syncUser = useCallback(
    async (nextUser: User) => {
      setProfile?.(nextUser);
      await updateUser?.(nextUser);
    },
    [setProfile, updateUser]
  );

  const logGpsIssue = useCallback(
    (type: "gps_denied" | "gps_error", text: string) => {
      if (!user) return;

      api
        .post("/activity", {
          type,
          priority: "warning",
          message: text,
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

  const sendPosition = useCallback(
    async (position: ExpoLocation.LocationObject, { force = false } = {}) => {
      if (!user) return null;

      const now = Date.now();
      if (!force && now - lastSentRef.current < SEND_THROTTLE_MS) return liveLocation;

      const payload = buildPayload(position, user.id, groupId);
      setSending(true);

      try {
        if (!sharingStartedRef.current) {
          const shareData = await api.post<ShareResponse>("/location/share/start", {});
          sharingStartedRef.current = true;
          await syncUser(shareData.user);
        }

        const data = await api.post<UpdateLocationResponse>("/location/update", payload);
        lastSentRef.current = now;
        setLiveLocation(data.location);
        setLastSentAt(new Date(now));
        setStatus("active");
        setError("");
        setMessage("Ubicacion real enviada correctamente.");
        return data.location;
      } catch (requestError) {
        const text =
          requestError instanceof Error
            ? requestError.message
            : "No fue posible enviar la ubicacion real.";
        setStatus("sending-error");
        setError(text);
        setMessage("Se mantiene el mapa de demostracion hasta reconectar.");
        logGpsIssue("gps_error", text);
        return null;
      } finally {
        setSending(false);
      }
    },
    [groupId, liveLocation, logGpsIssue, syncUser, user]
  );

  const startLiveLocation = useCallback(async () => {
    if (!user) {
      setError("Inicia sesion para compartir ubicacion real.");
      return;
    }

    setStatus("permission-pending");
    setError("");
    setMessage("Solicitando permiso de ubicacion.");

    try {
      const permission = await ExpoLocation.requestForegroundPermissionsAsync();

      if (permission.status !== ExpoLocation.PermissionStatus.GRANTED) {
        const text = "Permiso de ubicacion denegado. GeoKipu continuara en modo demostracion.";
        setStatus("denied");
        setMessage(text);
        setError(text);
        logGpsIssue("gps_denied", text);
        return;
      }

      const shareData = await api.post<ShareResponse>("/location/share/start", {});
      sharingStartedRef.current = true;
      await syncUser(shareData.user);

      const current = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High
      });
      await sendPosition(current, { force: true });

      stopSubscription();
      subscriptionRef.current = await ExpoLocation.watchPositionAsync(
        WATCH_OPTIONS,
        (position) => {
          void sendPosition(position);
        }
      );

      setStatus("active");
      setMessage("Ubicacion real activa mientras la app este abierta.");
      await reload?.();
    } catch (requestError) {
      const text =
        requestError instanceof Error
          ? requestError.message
          : "No fue posible activar la ubicacion real.";
      stopSubscription();
      setStatus("sending-error");
      setError(text);
      setMessage("Se mantiene el mapa de demostracion hasta resolver el problema.");
      logGpsIssue("gps_error", text);
    }
  }, [logGpsIssue, reload, sendPosition, stopSubscription, syncUser, user]);

  const pauseLiveLocation = useCallback(async () => {
    stopSubscription();
    lastSentRef.current = 0;
    setSending(false);

    try {
      const data = await api.post<ShareResponse>("/location/share/stop", {});
      sharingStartedRef.current = false;
      await syncUser(data.user);
      setStatus("paused");
      setMessage("Ubicacion pausada por el usuario.");
      setError("");
      await reload?.();
    } catch (requestError) {
      const text =
        requestError instanceof Error ? requestError.message : "No fue posible pausar la ubicacion.";
      setStatus("sending-error");
      setError(text);
      logGpsIssue("gps_error", text);
    }
  }, [logGpsIssue, reload, stopSubscription, syncUser]);

  const refreshNow = useCallback(async () => {
    if (!user) return;

    setError("");
    setMessage("Actualizando ubicacion real.");

    try {
      const permission = await ExpoLocation.getForegroundPermissionsAsync();
      if (permission.status !== ExpoLocation.PermissionStatus.GRANTED) {
        await startLiveLocation();
        return;
      }

      const current = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High
      });
      await sendPosition(current, { force: true });
      await reload?.();
    } catch (requestError) {
      const text =
        requestError instanceof Error ? requestError.message : "No fue posible actualizar ahora.";
      setStatus("sending-error");
      setError(text);
      logGpsIssue("gps_error", text);
    }
  }, [logGpsIssue, reload, sendPosition, startLiveLocation, user]);

  useEffect(() => stopSubscription, [stopSubscription]);

  return {
    error,
    isActive: status === "active" || status === "permission-pending",
    lastSentAt,
    liveLocation,
    message,
    pauseLiveLocation,
    refreshNow,
    sending,
    startLiveLocation,
    status
  };
}
