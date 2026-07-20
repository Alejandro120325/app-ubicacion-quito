import { AlertTriangle, CalendarDays, Crosshair, LocateFixed, Mail, MapPin, Phone, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { DetailRow } from "@/components/detail-row";
import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { PersonCard } from "@/components/person-card";
import { Pill } from "@/components/pill";
import { SectionHelp } from "@/components/section-help";
import { Text } from "@/components/text";
import { useAdminData } from "@/hooks/use-dashboard-data";
import { deleteUser } from "@/services/api";
import type { User } from "@/types";

const getLocationText = (location?: User["lastLocation"]) =>
  location?.address || location?.sector || "Sin datos";

const formatAccuracy = (value?: number | null) =>
  Number.isFinite(value) ? `${Math.round(Number(value))} m` : "Sin precision";

export function AdminPeopleScreen() {
  const { error, loading, people, reload } = useAdminData();
  const [selectedPerson, setSelectedPerson] = useState<User | null>(people[0] || null);

  useEffect(() => {
    setSelectedPerson((current) =>
      current && people.some((person) => person.id === current.id) ? current : people[0] || null
    );
  }, [people]);

  const removePerson = (person: User) => {
    Alert.alert(
      "Eliminar persona",
      `Eliminar a "${person.fullName}" de personas registradas, grupos y ubicaciones asociadas?`,
      [
        { style: "cancel", text: "Cancelar" },
        {
          style: "destructive",
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await deleteUser(person.id);
              setSelectedPerson(null);
              await reload();
              Alert.alert("Persona eliminada", response.message);
            } catch (requestError) {
              Alert.alert(
                "No se pudo eliminar",
                requestError instanceof Error ? requestError.message : "Intenta nuevamente."
              );
            }
          }
        }
      ]
    );
  };

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill tone="blue">Personas</Pill>
        <Text style={styles.title}>Personas registradas</Text>
        <Text muted style={styles.subtitle}>
          Persona Demo Quito, Camila Torres y Mateo Andrade son perfiles base de prueba.
        </Text>
      </View>

      <SectionHelp
        storageKey="geokipu_guide_people_seen"
        title="Que puedes hacer aqui?"
        description="Aqui puedes revisar las personas registradas y su informacion principal."
        bullets={[
          "Consulta nombre, correo, telefono y estado.",
          "Revisa detalles de cada persona.",
          "Usa esta informacion para contactar miembros de confianza."
        ]}
      />

      {error ? (
        <Card soft style={styles.notice}>
          <AlertTriangle color="#fde68a" size={18} />
          <Text style={styles.noticeText}>{error}</Text>
        </Card>
      ) : null}

      {loading ? <LoadingView message="Cargando personas..." /> : null}

      <View style={styles.list}>
        {people.map((person) => (
          <PersonCard key={person.id} person={person} onPress={setSelectedPerson} />
        ))}
      </View>

      {selectedPerson ? (
        <Card elevated style={styles.detail}>
          <Pill tone={selectedPerson.active ? "green" : "muted"}>
            {selectedPerson.active ? "Activo" : "Inactivo"}
          </Pill>
          <Text style={styles.detailTitle}>{selectedPerson.fullName}</Text>
          <Text muted style={styles.detailText}>
            Detalle de persona seleccionada para revision administrativa.
          </Text>
          <DetailRow icon={Mail} label="Correo" value={selectedPerson.email} />
          <DetailRow icon={Phone} label="Telefono" value={selectedPerson.phone} />
          <DetailRow
            icon={MapPin}
            label="Ultima ubicacion"
            value={getLocationText(selectedPerson.lastLocation)}
          />
          <DetailRow
            icon={LocateFixed}
            label="Tipo de ubicacion"
            value={selectedPerson.lastLocation?.simulated === false ? "GPS real" : "Modo demostracion"}
          />
          <DetailRow
            icon={Crosshair}
            label="Precision"
            value={formatAccuracy(selectedPerson.lastLocation?.accuracy)}
          />
          <DetailRow
            icon={CalendarDays}
            label="Ultima conexion"
            value={selectedPerson.lastConnection}
          />
          <ActionButton icon={Trash2} variant="danger" onPress={() => removePerson(selectedPerson)}>
            Eliminar persona
          </ActionButton>
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
  detail: {
    gap: 12
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28
  },
  detailText: {
    fontSize: 13,
    lineHeight: 19
  }
});
