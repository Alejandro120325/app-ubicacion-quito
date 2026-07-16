import { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { AlertTriangle, Save, X } from "lucide-react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { GradientScreen } from "@/components/gradient-screen";
import { GroupCard } from "@/components/group-card";
import { LoadingView } from "@/components/loading-view";
import { MemberCard } from "@/components/member-card";
import { Pill } from "@/components/pill";
import { SimulatedMap } from "@/components/simulated-map";
import { Text } from "@/components/text";
import { colors } from "@/constants/theme";
import { useAdminData } from "@/hooks/use-dashboard-data";
import { api } from "@/services/api";
import type { Group, GroupMember, LocationStatus } from "@/types";

type GroupResponse = {
  group: Group;
  member?: GroupMember;
};

const emptyMemberForm = {
  email: "",
  fullName: "",
  lastLocation: "Quito",
  locationStatus: "sharing" as LocationStatus,
  phone: "",
  relation: ""
};

export function AdminGroupsScreen() {
  const { error, groups, loading, reload } = useAdminData();
  const [localGroups, setLocalGroups] = useState<Group[]>(groups);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(groups[0]?.id || null);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(groups[0]?.members[0] || null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [memberMode, setMemberMode] = useState<"add" | "edit" | null>(null);
  const [memberDraft, setMemberDraft] = useState({ ...emptyMemberForm });
  const [editingMember, setEditingMember] = useState<GroupMember | null>(null);

  useEffect(() => {
    setLocalGroups(groups);
    setSelectedGroupId((current) =>
      current && groups.some((group) => group.id === current) ? current : groups[0]?.id || null
    );
  }, [groups]);

  const currentGroup =
    localGroups.find((group) => group.id === selectedGroupId) || localGroups[0] || null;

  const updateGroupState = (nextGroup: Group) => {
    setLocalGroups((current) =>
      current.map((group) => (group.id === nextGroup.id ? nextGroup : group))
    );
    setSelectedGroupId(nextGroup.id);
  };

  const selectGroup = (group: Group) => {
    setSelectedGroupId(group.id);
    setSelectedMember(group.members[0] || null);
    setMessage("");
  };

  const startEditGroup = (group: Group) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setGroupDescription(group.description || "");
  };

  const saveGroup = async () => {
    if (!editingGroup) return;
    setSaving(true);
    setMessage("");

    try {
      const data = await api.patch<GroupResponse>(`/groups/${editingGroup.id}`, {
        description: groupDescription,
        name: groupName
      });
      updateGroupState(data.group);
      setEditingGroup(null);
      setMessage("Grupo actualizado correctamente.");
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "No se pudo actualizar el grupo.");
    } finally {
      setSaving(false);
    }
  };

  const deleteGroup = (group: Group) => {
    Alert.alert("Eliminar grupo", `Quitar "${group.name}"? Los usuarios globales no se eliminan.`, [
      { style: "cancel", text: "Cancelar" },
      {
        style: "destructive",
        text: "Eliminar",
        onPress: async () => {
          try {
            await api.delete(`/groups/${group.id}`);
            const nextGroups = localGroups.filter((item) => item.id !== group.id);
            setLocalGroups(nextGroups);
            setSelectedGroupId(nextGroups[0]?.id || null);
            setSelectedMember(nextGroups[0]?.members[0] || null);
            setMessage("Grupo eliminado correctamente.");
          } catch (requestError) {
            setMessage(requestError instanceof Error ? requestError.message : "No se pudo eliminar el grupo.");
          }
        }
      }
    ]);
  };

  const startAddMember = (group: Group) => {
    setSelectedGroupId(group.id);
    setEditingMember(null);
    setMemberDraft({ ...emptyMemberForm });
    setMemberMode("add");
  };

  const startEditMember = (member: GroupMember) => {
    setEditingMember(member);
    setMemberDraft({
      email: member.email || "",
      fullName: member.fullName || "",
      lastLocation: member.lastLocation || "",
      locationStatus: member.locationStatus || "sharing",
      phone: member.phone || "",
      relation: member.relation || ""
    });
    setMemberMode("edit");
  };

  const saveMember = async () => {
    if (!currentGroup || !memberMode) return;
    setSaving(true);
    setMessage("");

    try {
      const data =
        memberMode === "add"
          ? await api.post<GroupResponse>(`/groups/${currentGroup.id}/members`, memberDraft)
          : await api.patch<GroupResponse>(`/groups/${currentGroup.id}/members/${editingMember?.id}`, memberDraft);
      updateGroupState(data.group);
      setSelectedMember(data.member || data.group.members[0] || null);
      setMemberMode(null);
      setEditingMember(null);
      setMessage(memberMode === "add" ? "Integrante agregado correctamente." : "Integrante actualizado correctamente.");
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "No se pudo guardar el integrante.");
    } finally {
      setSaving(false);
    }
  };

  const removeMember = (member: GroupMember) => {
    if (!currentGroup) return;

    Alert.alert("Quitar integrante", `Quitar a "${member.fullName}" del grupo "${currentGroup.name}"?`, [
      { style: "cancel", text: "Cancelar" },
      {
        style: "destructive",
        text: "Quitar",
        onPress: async () => {
          try {
            const data = await api.delete<GroupResponse>(`/groups/${currentGroup.id}/members/${member.id}`);
            updateGroupState(data.group);
            setSelectedMember(data.group.members[0] || null);
            setMessage("Integrante quitado correctamente.");
          } catch (requestError) {
            setMessage(requestError instanceof Error ? requestError.message : "No se pudo quitar el integrante.");
          }
        }
      }
    ]);
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill tone="green">Grupos</Pill>
        <Text style={styles.title}>Grupos familiares y contactos</Text>
        <Text muted style={styles.subtitle}>
          Gestiona grupos e integrantes usando el backend local de GeoKipu.
        </Text>
      </View>

      {error ? (
        <Card soft style={styles.notice}>
          <AlertTriangle color="#fde68a" size={18} />
          <Text style={styles.noticeText}>{error}</Text>
        </Card>
      ) : null}
      {message ? (
        <Card soft style={styles.notice}>
          <Text style={styles.noticeText}>{message}</Text>
        </Card>
      ) : null}

      {loading ? <LoadingView message="Cargando grupos..." /> : null}

      <View style={styles.list}>
        {localGroups.map((group) => (
          <GroupCard
            active={currentGroup?.id === group.id}
            group={group}
            key={group.id}
            onAddMember={startAddMember}
            onDelete={deleteGroup}
            onEdit={startEditGroup}
            onPress={selectGroup}
          />
        ))}
      </View>

      {editingGroup ? (
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Editar grupo</Text>
          <TextInput
            placeholder="Nombre"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
          />
          <TextInput
            multiline
            placeholder="Descripcion"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.textarea]}
            value={groupDescription}
            onChangeText={setGroupDescription}
          />
          <View style={styles.formActions}>
            <ActionButton icon={X} variant="secondary" onPress={() => setEditingGroup(null)}>
              Cancelar
            </ActionButton>
            <ActionButton icon={Save} loading={saving} onPress={saveGroup}>
              Guardar
            </ActionButton>
          </View>
        </Card>
      ) : null}

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
              <MemberCard
                key={member.id}
                member={member}
                onDelete={removeMember}
                onEdit={startEditMember}
                onPress={setSelectedMember}
              />
            ))}
          </View>
        </Card>
      ) : null}

      {memberMode ? (
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            {memberMode === "add" ? "Agregar integrante" : "Editar integrante"}
          </Text>
          <TextInput
            placeholder="Nombre"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={memberDraft.fullName}
            onChangeText={(fullName) => setMemberDraft((current) => ({ ...current, fullName }))}
          />
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Correo"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={memberDraft.email}
            onChangeText={(email) => setMemberDraft((current) => ({ ...current, email }))}
          />
          <TextInput
            keyboardType="phone-pad"
            placeholder="Telefono"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={memberDraft.phone}
            onChangeText={(phone) => setMemberDraft((current) => ({ ...current, phone }))}
          />
          <TextInput
            placeholder="Relacion"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={memberDraft.relation}
            onChangeText={(relation) => setMemberDraft((current) => ({ ...current, relation }))}
          />
          <TextInput
            placeholder="Ultima ubicacion"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={memberDraft.lastLocation}
            onChangeText={(lastLocation) => setMemberDraft((current) => ({ ...current, lastLocation }))}
          />
          <View style={styles.formActions}>
            <ActionButton icon={X} variant="secondary" onPress={() => setMemberMode(null)}>
              Cancelar
            </ActionButton>
            <ActionButton icon={Save} loading={saving} onPress={saveMember}>
              Guardar
            </ActionButton>
          </View>
        </Card>
      ) : null}

      <ActionButton variant="secondary" onPress={reload}>
        Recargar datos
      </ActionButton>
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
  },
  formCard: {
    gap: 12
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.075)",
    borderColor: colors.glassBorder,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  textarea: {
    minHeight: 88,
    textAlignVertical: "top"
  },
  formActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});
