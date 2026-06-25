import type { Group, MapPoint, User } from "@/types";

export const demoCredentials = [
  {
    role: "Admin",
    email: "admin@quitoapp.com",
    password: "Admin123"
  },
  {
    role: "Persona",
    email: "persona@quitoapp.com",
    password: "Persona123"
  }
];

export const fallbackPeople: User[] = [
  {
    id: 2,
    fullName: "Persona Demo Quito",
    email: "persona@quitoapp.com",
    role: "persona",
    language: "es",
    cedula: "0926687856",
    phone: "0987654321",
    active: true,
    sharingLocation: true,
    lastConnection: "2026-06-21 15:32",
    lastLocation: {
      userId: 2,
      city: "Quito",
      sector: "La Carolina",
      latitude: -0.1807,
      longitude: -78.4678,
      lastUpdate: "2026-06-21 15:30",
      sharing: true,
      simulated: true
    }
  },
  {
    id: 3,
    fullName: "Camila Torres",
    email: "camila.torres@example.com",
    role: "persona",
    language: "es",
    cedula: "1710000017",
    phone: "0971112233",
    active: false,
    sharingLocation: false,
    lastConnection: "2026-06-21 12:05",
    lastLocation: {
      userId: 3,
      city: "Quito",
      sector: "Cumbaya",
      latitude: -0.2009,
      longitude: -78.4335,
      lastUpdate: "2026-06-21 14:45",
      sharing: false,
      simulated: true
    }
  },
  {
    id: 4,
    fullName: "Mateo Andrade",
    email: "mateo.andrade@example.com",
    role: "persona",
    language: "en",
    cedula: "1710000025",
    phone: "0964445566",
    active: true,
    sharingLocation: true,
    lastConnection: "2026-06-21 14:18",
    lastLocation: {
      userId: 4,
      city: "Quito",
      sector: "Quitumbe",
      latitude: -0.2912,
      longitude: -78.5532,
      lastUpdate: "2026-06-21 13:20",
      sharing: true,
      simulated: true
    }
  }
];

export const fallbackGroups: Group[] = [
  {
    id: 1,
    name: "Familia",
    createdBy: 2,
    description: "Circulo familiar de prueba para seguimiento consentido.",
    members: [
      {
        id: 1,
        fullName: "Persona Demo Quito",
        email: "persona@quitoapp.com",
        phone: "0987654321",
        cedula: "0926687856",
        relation: "Yo",
        locationStatus: "sharing",
        lastLocation: "La Carolina - Quito",
        lastUpdate: "Actualizado hace unos segundos",
        top: "27%",
        left: "62%"
      },
      {
        id: 2,
        fullName: "Maria Torres",
        email: "maria.torres@example.com",
        phone: "0991112222",
        cedula: "1710034065",
        relation: "Madre",
        locationStatus: "sharing",
        lastLocation: "Centro Historico - Quito",
        lastUpdate: "Actualizado hace 1 min",
        top: "55%",
        left: "36%"
      },
      {
        id: 3,
        fullName: "Daniel Ruiz",
        email: "daniel.ruiz@example.com",
        phone: "0993334444",
        cedula: "1710000017",
        relation: "Hermano",
        locationStatus: "paused",
        lastLocation: "Universidad - Quito",
        lastUpdate: "Pausado por el usuario",
        top: "61%",
        left: "48%"
      },
      {
        id: 4,
        fullName: "Sofia Andrade",
        email: "sofia.andrade@example.com",
        phone: "0995556666",
        cedula: "1710000025",
        relation: "Contacto seguro",
        locationStatus: "offline",
        lastLocation: "Cumbaya - Quito",
        lastUpdate: "Sin conexion reciente",
        top: "45%",
        left: "76%"
      }
    ]
  }
];

export const mapMarkers: MapPoint[] = [
  { label: "La Carolina", top: "27%", left: "62%", locationStatus: "sharing" },
  { label: "Cumbaya", top: "45%", left: "76%", locationStatus: "offline" },
  { label: "Centro Historico", top: "55%", left: "36%", locationStatus: "sharing" },
  { label: "Universidad", top: "61%", left: "48%", locationStatus: "sharing" },
  { label: "Quitumbe", top: "72%", left: "58%", locationStatus: "paused" }
];

export const alerts = [
  {
    title: "Revisar ubicacion pausada",
    body: "Daniel Ruiz pauso el uso compartido dentro del grupo Familia.",
    time: "Hace 4 min",
    tone: "warning"
  },
  {
    title: "Simulacion activa",
    body: "Los marcadores del mapa se mantienen con datos de prueba.",
    time: "Ahora",
    tone: "info"
  }
];

export const apiFacts = [
  {
    label: "Empresa proveedora",
    value: "Geoapify GmbH"
  },
  {
    label: "Costo de uso",
    value: "Plan gratuito con creditos diarios y planes pagados."
  },
  {
    label: "Por que aplica",
    value:
      "Convertir direcciones de Quito a coordenadas, obtener rutas y consultar lugares seguros cercanos."
  },
  {
    label: "Variable de entorno",
    value: "VITE_MAP_API_KEY"
  }
];
