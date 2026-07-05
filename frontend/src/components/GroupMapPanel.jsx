import React from "react";
import SimulatedMap from "./SimulatedMap.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const statusToActive = (status) => status === "sharing";

const GroupMapPanel = ({
  className = "",
  group,
  locations = [],
  polling = false,
  selectedMember,
  variant = "group"
}) => {
  const { t } = useLanguage();
  const members = group?.members || [];
  const points = members.map((member) => ({
    label: member.relation || member.fullName,
    active: statusToActive(member.locationStatus),
    locationStatus: member.locationStatus,
    top: member.top || "50%",
    left: member.left || "50%"
  }));

  return (
    <article className={`glass-card p-4 sm:p-5 ${className}`}>
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
          {t("groups.groupMap")}
        </p>
        <h3 className="mt-1 text-xl font-bold text-[var(--color-text)]">
          {group?.name || t("groups.title")}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {t("groups.groupMapText")}
        </p>
      </div>
      <SimulatedMap
        members={members}
        groupMembers={members}
        locations={locations}
        polling={polling}
        selectedGroup={group}
        points={points}
        selectedMember={selectedMember}
        showMembers
        showConnections
        variant={variant}
      />
    </article>
  );
};

export default GroupMapPanel;
