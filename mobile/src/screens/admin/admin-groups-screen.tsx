import { Alert, StyleSheet, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";

import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { GroupCard } from "@/components/group-card";
import { LoadingView } from "@/components/loading-view";
import { MemberCard } from "@/components/member-card";
import { Pill } from "@/components/pill";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";
import { useAdminData } from "@/hooks/use-dashboard-data";
import type { Group, GroupMember } from "@/types";
import { useState } from "react";

export function AdminGroupsScreen() {
  const { error, groups, loading } = useAdminData();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(groups[0] || null);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
    groups[0]?.members[0] || null
  );

  const currentGroup = selectedGroup || groups[0] || null;

  const selectGroup = (group: Group) => {
    setSelectedGroup(group);
    setSelectedMember(group.members[0] || null);
  };

  const showFutureAction = () => {
    Alert.alert(
      "Agregar integrante",
      "El backend ya tiene endpoint para integrantes. Esta pantalla conserva el boton como flujo listo para conectar a un formulario movil."
    );
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill tone="green">Grupos</Pill>
        <Text style={styles.title}>Grupos familiares y contactos</Text>
        <Text muted style={styles.subtitle}>
          Grupo principal Familia con integrantes y estados de ubicacion simulados.
        </Text>
      </View>

      {error ? (
        <Card soft style={styles.notice}>
          <AlertTriangle color="#fde68a" size={18} />
          <Text style={styles.noticeText}>{error}</Text>
        </Card>
      ) : null}

      {loading ? <LoadingView message="Cargando grupos..." /> : null}

      <View style={styles.list}>
        {groups.map((group) => (
          <GroupCard
            active={currentGroup?.id === group.id}
            group={group}
            key={group.id}
            onAddMember={showFutureAction}
            onPress={selectGroup}
          />
        ))}
      </View>

      {currentGroup ? (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Mapa del grupo {currentGroup.name}</Text>
          <SimulatedMap
            height={330}
            points={currentGroup.members.map((member) => ({
              label: member.fullName,
              left: member.left,
              locationStatus: member.locationStatus,
              top: member.top
            }))}
            selectedLabel={selectedMember?.fullName}
            showConnections
          />
          <View style={styles.members}>
            {currentGroup.members.map((member) => (
              <MemberCard key={member.id} member={member} onPress={setSelectedMember} />
            ))}
          </View>
        </Card>
      ) : null}
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingTop: 12
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 37
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22
  },
  notice: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    padding: 12
  },
  noticeText: {
    color: "#fde68a",
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  list: {
    gap: 12
  },
  section: {
    gap: 14
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900"
  },
  members: {
    gap: 12
  }
});
