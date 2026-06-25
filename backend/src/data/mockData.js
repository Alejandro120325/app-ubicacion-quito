export const TOKEN_PREFIX = "token-simulado";

export const locations = [
  {
    userId: 1,
    city: "Quito",
    sector: "Centro Historico",
    latitude: -0.2202,
    longitude: -78.5127,
    lastUpdate: "2026-06-21 15:10"
  },
  {
    userId: 2,
    city: "Quito",
    sector: "La Carolina",
    latitude: -0.1807,
    longitude: -78.4678,
    lastUpdate: "2026-06-21 15:30"
  },
  {
    userId: 3,
    city: "Quito",
    sector: "Cumbaya",
    latitude: -0.2009,
    longitude: -78.4335,
    lastUpdate: "2026-06-21 14:45"
  },
  {
    userId: 4,
    city: "Quito",
    sector: "Quitumbe",
    latitude: -0.2912,
    longitude: -78.5532,
    lastUpdate: "2026-06-21 13:20"
  }
];

export const users = [
  {
    id: 1,
    fullName: "Administrador Quito",
    email: "admin@quitoapp.com",
    password: "Admin123",
    role: "admin",
    language: "es",
    cedula: "1710034065",
    phone: "0991234567",
    active: true,
    sharingLocation: true,
    lastConnection: "2026-06-21 15:40"
  },
  {
    id: 2,
    fullName: "Persona Demo Quito",
    email: "persona@quitoapp.com",
    password: "Persona123",
    role: "persona",
    language: "es",
    cedula: "0926687856",
    phone: "0987654321",
    active: true,
    sharingLocation: true,
    lastConnection: "2026-06-21 15:32"
  },
  {
    id: 3,
    fullName: "Camila Torres",
    email: "camila.torres@example.com",
    password: "Camila123",
    role: "persona",
    language: "es",
    cedula: "1710000017",
    phone: "0971112233",
    active: false,
    sharingLocation: false,
    lastConnection: "2026-06-21 12:05"
  },
  {
    id: 4,
    fullName: "Mateo Andrade",
    email: "mateo.andrade@example.com",
    password: "Mateo123",
    role: "persona",
    language: "en",
    cedula: "1710000025",
    phone: "0964445566",
    active: true,
    sharingLocation: true,
    lastConnection: "2026-06-21 14:18"
  }
];

export const groups = [
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

export const createSimulatedToken = (userId) => `${TOKEN_PREFIX}-${userId}`;

export const getUserFromToken = (token) => {
  if (!token) return null;

  if (token === TOKEN_PREFIX) {
    return users[0];
  }

  if (!token.startsWith(`${TOKEN_PREFIX}-`)) {
    return null;
  }

  const userId = Number(token.replace(`${TOKEN_PREFIX}-`, ""));
  return users.find((user) => user.id === userId) || null;
};

export const getLocationByUserId = (userId) =>
  locations.find((location) => location.userId === Number(userId));

export const updateLocationSharing = (userId, sharing) => {
  const user = users.find((item) => item.id === Number(userId));

  if (!user) return null;

  user.sharingLocation = sharing;
  user.active = sharing;
  user.lastConnection = "2026-06-21 15:45";

  return user;
};

export const getVisibleGroups = (user) => {
  if (user.role === "admin") return groups;

  return groups.filter(
    (group) =>
      group.createdBy === user.id ||
      group.members.some((member) => member.email === user.email)
  );
};

export const getGroupById = (groupId) =>
  groups.find((group) => group.id === Number(groupId));

export const createGroup = ({ name, description = "", createdBy }) => {
  const nextGroup = {
    id: groups.length ? Math.max(...groups.map((group) => group.id)) + 1 : 1,
    name,
    description,
    createdBy,
    members: []
  };

  groups.push(nextGroup);
  return nextGroup;
};

export const addMemberToGroup = (groupId, member) => {
  const group = getGroupById(groupId);
  if (!group) return null;

  const nextMember = {
    id: group.members.length
      ? Math.max(...group.members.map((item) => item.id)) + 1
      : 1,
    locationStatus: "paused",
    lastLocation: "La Mariscal - Quito",
    lastUpdate: "Actualizado hace unos segundos",
    top: `${34 + ((group.members.length * 9) % 42)}%`,
    left: `${32 + ((group.members.length * 13) % 44)}%`,
    ...member
  };

  group.members.push(nextMember);
  return nextMember;
};

export const updateMemberLocationStatus = (groupId, memberId, locationStatus) => {
  const group = getGroupById(groupId);
  if (!group) return null;

  const member = group.members.find((item) => item.id === Number(memberId));
  if (!member) return null;

  member.locationStatus = locationStatus;
  member.lastUpdate =
    locationStatus === "sharing"
      ? "Actualizado hace unos segundos"
      : locationStatus === "paused"
        ? "Pausado por el usuario"
        : "Sin conexion reciente";

  return member;
};
