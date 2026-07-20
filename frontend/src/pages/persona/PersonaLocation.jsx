import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Crosshair, MapPin, Power, RefreshCw, ShieldCheck } from "lucide-react";
import { getReverseAddress, mapsApi } from "../../api/mapsApi.js";
import Button from "../../components/Button.jsx";
import HeaderActions from "../../components/HeaderActions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import SectionHelp from "../../components/SectionHelp.jsx";
import SimulatedMap from "../../components/SimulatedMap.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useLiveLocation } from "../../hooks/useLiveLocation.js";
import { usePersonaWorkspace } from "../../hooks/usePersonaWorkspace.js";
import { pageTransition } from "../../utils/animations.js";

const PersonaLocation = () => {
  const { t } = useLanguage();
  const { error: workspaceError, loading, location, selectedGroup } = usePersonaWorkspace();
  const [address, setAddress] = useState("");
  const [addressStatus, setAddressStatus] = useState("");
  const {
    currentLocation,
    error: gpsError,
    isTracking,
    lastSentAt,
    refreshNow,
    sending,
    startTracking,
    status,
    stopTracking
  } = useLiveLocation({ groupId: selectedGroup?.id || null });

  useEffect(() => {
    if (!Number.isFinite(currentLocation?.latitude) || !Number.isFinite(currentLocation?.longitude)) return;
    if (currentLocation.address) {
      setAddress(currentLocation.address);
      setAddressStatus("");
      return;
    }

    let active = true;
    mapsApi
      .reverse(currentLocation.latitude, currentLocation.longitude)
      .then((payload) => {
        if (active) {
          setAddress(getReverseAddress(payload));
          setAddressStatus("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setAddressStatus(
            requestError.response?.data?.code === "GEOAPIFY_NOT_CONFIGURED"
              ? t("gps.apiFallback")
              : t("gps.addressUnavailable")
          );
        }
      });

    return () => {
      active = false;
    };
  }, [currentLocation, t]);

  if (loading) return <LoadingScreen message={t("persona.loading")} />;

  const displayLocation = currentLocation || location;
  const displayAddress = address || displayLocation?.address || "";
  const error = gpsError || workspaceError;

  return (
    <motion.section className="mx-auto grid max-w-7xl gap-8" {...pageTransition}>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            {t("sidebar.myLocation")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
            {t("gps.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            {t("gps.privacyNotice")}
          </p>
        </div>
        <HeaderActions
          badges={[
            {
              className: isTracking
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-[var(--color-border)] bg-[var(--color-soft)] text-[var(--color-muted)]",
              icon: BadgeCheck,
              label: t(`gps.status.${status}`)
            }
          ]}
        />
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

      <SectionHelp
        storageKey="geokipu_guide_map_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes visualizar la ubicacion compartida o el modo demostracion de GeoKipu."
        bullets={[
          "Revisa la ultima ubicacion disponible.",
          "Identifica sectores importantes en el mapa.",
          "Activa o pausa el seguimiento con consentimiento."
        ]}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="glass-card min-w-0 p-4 sm:p-5">
          <SimulatedMap
            currentUserLocation={currentLocation}
            lastUpdate={lastSentAt?.toLocaleString() || displayLocation?.lastUpdate}
            mode={currentLocation ? "live" : "simulated"}
            points={currentLocation ? [] : [{ ...location, label: location?.sector || t("persona.noSector"), locationStatus: "paused" }]}
            selectedLabel={currentLocation ? undefined : location?.sector}
            variant="large"
          />
        </section>

        <aside className="grid gap-5">
          <article className="glass-card p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
              {t("persona.currentStatus")}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
              {t(`gps.status.${status}`)}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {isTracking ? t("gps.shared") : t("gps.paused")}
            </p>
            <Button
              className="mt-6 w-full"
              icon={isTracking ? Power : Crosshair}
              size="lg"
              variant={isTracking ? "dark" : "success"}
              onClick={isTracking ? stopTracking : startTracking}
            >
              {status === "permission-pending"
                ? t("gps.requesting")
                : isTracking
                  ? t("persona.pause")
                  : t("gps.activate")}
            </Button>
            <Button
              className="mt-3 w-full"
              icon={RefreshCw}
              size="lg"
              variant="secondary"
              onClick={refreshNow}
            >
              {sending ? t("gps.sending") : t("gps.refresh")}
            </Button>
          </article>

          <article className="glass-card p-6">
            <p className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
              <MapPin className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              {currentLocation ? t("gps.coordinates") : t("persona.lastSimulated")}
            </p>
            {currentLocation ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-[var(--color-muted)]">Latitud</dt><dd className="mt-1 font-semibold">{currentLocation.latitude.toFixed(6)}</dd></div>
                <div><dt className="text-[var(--color-muted)]">Longitud</dt><dd className="mt-1 font-semibold">{currentLocation.longitude.toFixed(6)}</dd></div>
                <div><dt className="text-[var(--color-muted)]">Sector</dt><dd className="mt-1 font-semibold">{currentLocation.sector || "GPS"}</dd></div>
                <div><dt className="text-[var(--color-muted)]">{t("gps.accuracy")}</dt><dd className="mt-1 font-semibold">{currentLocation.accuracy == null ? "-" : `${Math.round(currentLocation.accuracy)} m`}</dd></div>
                <div><dt className="text-[var(--color-muted)]">{t("gps.updated")}</dt><dd className="mt-1 font-semibold">{lastSentAt?.toLocaleTimeString() || "-"}</dd></div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-[var(--color-muted)]">{location?.sector || t("persona.noSector")} - Quito</p>
            )}
            {displayAddress || addressStatus ? (
              <p className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-3 text-sm leading-6 text-[var(--color-muted)]">
                Direccion aproximada: {displayAddress || addressStatus}
              </p>
            ) : null}
          </article>

          <article className="glass-card-subtle p-4 text-sm text-[var(--color-muted)]">
            <p className="flex items-start gap-2 leading-6">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-secondary)]" />
              {t("gps.groupOnly")}
            </p>
          </article>
        </aside>
      </div>
    </motion.section>
  );
};

export default PersonaLocation;
