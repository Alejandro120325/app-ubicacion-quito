import { Activity, AlertTriangle, CalendarDays, Mail, MapPin, Phone, UserCheck, UsersRound, UserX } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/card";
import { DetailRow } from "@/components/detail-row";
import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { PersonCard } from "@/components/person-card";
import { Pill } from "@/components/pill";
import { SimulatedMap } from "@/components/simulated-map";
import { StatCard } from "@/components/stat-card";
import { Text } from "@/components/text";
import { useAuth } from "@/context/auth-context";
import { mapMarkers } from "@/data/mock-data";
import { useAdminData } from "@/hooks/use-dashboard-data";
import type { User } from "@/types";

export function AdminHomeScreen() {
  const { user } = useAuth();
  const { error, groups, loading, people } = useAdminData();
  const [selectedPerson, setSelectedPerson] = useState<User | null>(people[0] || null);

  useEffect(() => {
    setSelectedPerson((current) => current || people[0] || null);
  }, [people]);

  const stats = useMemo(() => {
    const active = people.filter((person) => person.active).length;
    const inactive = people.filter((person) => !person.active).length;
    const alerts = people.filter((person) => !person.sharingLocation).length;

    return { active, alerts, groups: groups.length, inactive, total: people.length };
  }, [groups.length, people]);

  const points = useMemo(
    () =>
      people.map((person, index) => ({
        label: person.lastLocation?.sector || person.fullName,
        active: person.active,
        left: mapMarkers[index % mapMarkers.length].left,
        top: mapMarkers[index % mapMarkers.length].top
      })),
    [people]
  );

  return (
    <GradientScreen>
      <View style={styles.header}>
        <Pill icon={CalendarDays} tone="blue">
          Panel administrador
        </Pill>
        <Text style={styles.title}>Hola, {user?.fullName || "Administrador Quito"}</Text>
        <Text muted style={styles.subtitle}>
          Supervisa personas, grupos y alertas simuladas de ubicacion en Quito.
        </Text>
      </View>

      {error ? (
        <Card soft style={styles.notice}>
          <AlertTriangle color="#fde68a" size={18} />
          <Text style={styles.noticeText}>{error}</Text>
        </Card>
      ) : null}

      <View style={styles.stats}>
        <StatCard detail="Perfiles tipo persona" icon={UsersRound} label="Personas registradas" value={loading ? "..." : stats.total} />
        <StatCard detail="Compartiendo ahora" icon={UserCheck} label="Personas activas" tone="green" value={loading ? "..." : stats.active} />
        <StatCard detail="Sin compartir" icon={UserX} label="Personas inactivas" tone="slate" value={loading ? "..." : stats.inactive} />
        <StatCard detail="Circulos visibles" icon={UsersRound} label="Grupos creados" value={loading ? "..." : stats.groups} />
        <StatCard detail="Eventos por revisar" icon={Activity} label="Alertas simuladas" tone="amber" value={loading ? "..." : stats.alerts} />
      </View>

      {loading ? <LoadingView message="Cargando panel admin..." /> : null}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Personas registradas</Text>
        <Text muted style={styles.sectionText}>
          Selecciona una persona para revisar su detalle y ultima ubicacion.
        </Text>
        <View style={styles.list}>
          {people.map((person) => (
            <PersonCard key={person.id} person={person} onPress={setSelectedPerson} />
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Mapa simulado de Quito</Text>
        <Text muted style={styles.sectionText}>
          Marcadores visuales basados en ubicaciones del backend o datos demo.
        </Text>
        <SimulatedMap
          height={340}
          lastUpdate={selectedPerson?.lastLocation?.lastUpdate}
          points={points}
          selectedLabel={selectedPerson?.lastLocation?.sector}
        />
      </Card>

      {selectedPerson ? (
        <Card elevated style={styles.section}>
          <Pill tone={selectedPerson.active ? "green" : "muted"}>
            {selectedPerson.active ? "Activo" : "Inactivo"}
          </Pill>
          <Text style={styles.detailName}>{selectedPerson.fullName}</Text>
          <View style={styles.details}>
            <DetailRow icon={Mail} label="Correo" value={selectedPerson.email} />
            <DetailRow icon={Phone} label="Telefono" value={selectedPerson.phone} />
            <DetailRow
              icon={MapPin}
              label="Ultima ubicacion"
              value={`${selectedPerson.lastLocation?.sector || "Sin datos"} - Quito`}
            />
            <DetailRow
              icon={CalendarDays}
              label="Ultima conexion"
              value={selectedPerson.lastConnection}
            />
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
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  section: {
    gap: 14
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 26
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 19
  },
  list: {
    gap: 12
  },
  detailName: {
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28
  },
  details: {
    gap: 10
  }
});
