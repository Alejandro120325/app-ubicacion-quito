import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  UserX,
  UsersRound
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../api/api.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import SimulatedMap from "../components/SimulatedMap.jsx";
import StatCard from "../components/StatCard.jsx";
import UserCard from "../components/UserCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const pointPositions = [
  { top: "23%", left: "58%" },
  { top: "48%", left: "42%" },
  { top: "36%", left: "76%" },
  { top: "73%", left: "34%" },
  { top: "57%", left: "60%" }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const { data } = await api.get("/users");
        setPeople(data.users || []);
        setSelectedPerson(data.users?.[0] || null);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "No se pudo cargar la información simulada."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPeople();
  }, []);

  const stats = useMemo(() => {
    const activePeople = people.filter((person) => person.active);
    const inactivePeople = people.filter((person) => !person.active);
    const simulatedAlerts = people.filter((person) => !person.sharingLocation);

    return {
      total: people.length,
      active: activePeople.length,
      inactive: inactivePeople.length,
      alerts: simulatedAlerts.length
    };
  }, [people]);

  const mapPoints = useMemo(
    () =>
      people.map((person, index) => ({
        label: person.lastLocation?.sector || person.fullName,
        active: person.active,
        ...pointPositions[index % pointPositions.length]
      })),
    [people]
  );

  return (
    <motion.section
      className="mx-auto max-w-7xl"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-sky-600">
            Panel administrador
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Hola, {user.fullName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Revisa personas registradas, estados, alertas y ubicaciones
            simuladas dentro de Quito y alrededores.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          Ubicación simulada
        </span>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail="Perfiles tipo persona"
          icon={UsersRound}
          title="Personas registradas"
          tone="blue"
          value={loading ? "..." : stats.total}
        />
        <StatCard
          detail="Compartiendo ubicación"
          icon={UserCheck}
          title="Personas activas"
          tone="mint"
          value={loading ? "..." : stats.active}
        />
        <StatCard
          detail="Sin compartir ahora"
          icon={UserX}
          title="Personas inactivas"
          tone="slate"
          value={loading ? "..." : stats.inactive}
        />
        <StatCard
          detail="Casos para revisar"
          icon={Activity}
          title="Alertas simuladas"
          tone="amber"
          value={loading ? "..." : stats.alerts}
        />
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingScreen message="Cargando personas simuladas..." />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Personas registradas
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Selecciona una persona para ver su detalle simulado.
                </p>
              </div>
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                {people.length} perfiles
              </span>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {people.map((person) => (
                <UserCard
                  key={person.id}
                  user={person}
                  onView={() => setSelectedPerson(person)}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-6">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Mapa simulado de Quito
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Referencia visual sin APIs externas.
                  </p>
                </div>
              </div>
              <SimulatedMap
                className="h-[390px]"
                lastUpdate={selectedPerson?.lastLocation?.lastUpdate}
                points={mapPoints}
                selectedLabel={selectedPerson?.lastLocation?.sector}
              />
            </div>

            {selectedPerson ? (
              <motion.article
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-sky-600">
                      Detalle
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-950">
                      {selectedPerson.fullName}
                    </h3>
                  </div>
                  <span
                    className={`rounded-lg px-3 py-2 text-xs font-bold ${
                      selectedPerson.active
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedPerson.active ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      Correo
                    </dt>
                    <dd className="mt-1 break-words font-semibold text-slate-900">
                      {selectedPerson.email}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      Teléfono
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {selectedPerson.phone}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      Última ubicación
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {selectedPerson.lastLocation?.sector || "Sin dato"} · Quito
                    </dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      Última conexión
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {selectedPerson.lastConnection}
                    </dd>
                  </div>
                </dl>
              </motion.article>
            ) : null}
          </section>
        </div>
      )}
    </motion.section>
  );
};

export default AdminDashboard;
