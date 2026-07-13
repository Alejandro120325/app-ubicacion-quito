export const TOKEN_PREFIX = "token-simulado";

export const locations = [
  {
    id: 1,
    userId: 1,
    groupId: null,
    city: "Quito",
    sector: "Centro Historico",
    latitude: -0.2202,
    longitude: -78.5127,
    lastUpdate: "2026-06-21 15:10",
    sharing: false,
    simulated: true
  },
  {
    id: 2,
    userId: 2,
    groupId: 1,
    city: "Quito",
    sector: "La Carolina",
    latitude: -0.1807,
    longitude: -78.4678,
    lastUpdate: "2026-06-21 15:30",
    sharing: true,
    simulated: true
  },
  {
    id: 3,
    userId: 3,
    groupId: null,
    city: "Quito",
    sector: "Cumbaya",
    latitude: -0.2009,
    longitude: -78.4335,
    lastUpdate: "2026-06-21 14:45",
    sharing: false,
    simulated: true
  },
  {
    id: 4,
    userId: 4,
    groupId: null,
    city: "Quito",
    sector: "Quitumbe",
    latitude: -0.2912,
    longitude: -78.5532,
    lastUpdate: "2026-06-21 13:20",
    sharing: true,
    simulated: true
  }
];

export const users = [
  {
    id: 1,
    fullName: "Administrador GeoKipu",
    email: "admin@geokipu.com",
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
    fullName: "Persona Demo GeoKipu",
    email: "persona@geokipu.com",
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
        userId: 2,
        fullName: "Persona Demo GeoKipu",
        email: "persona@geokipu.com",
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

const locationTimestamp = (location) =>
  new Date(location.updatedAt || location.lastUpdate || 0).getTime() || 0;

export const getLocationByUserId = (userId) =>
  locations
    .filter((location) => location.userId === Number(userId))
    .reduce(
      (latest, location) =>
        !latest || locationTimestamp(location) > locationTimestamp(latest)
          ? location
          : latest,
      null
    );

export const getLocationByUserAndGroupId = (userId, groupId) =>
  locations.find(
    (location) =>
      location.userId === Number(userId) && location.groupId === Number(groupId)
  ) ||
  locations.find(
    (location) => location.userId === Number(userId) && location.groupId == null
  );

export const updateLocationSharing = (userId, sharing) => {
  const user = users.find((item) => item.id === Number(userId));

  if (!user) return null;

  user.sharingLocation = sharing;
  user.active = sharing;
  user.lastConnection = new Date().toISOString();

  locations
    .filter((location) => location.userId === Number(userId))
    .forEach((location) => {
      location.sharing = sharing;
      location.lastUpdate = new Date().toISOString();
    });

  groups.forEach((group) => {
    group.members
      .filter((member) => member.userId === Number(userId) || member.email === user.email)
      .forEach((member) => {
        member.locationStatus = sharing ? "sharing" : "paused";
        member.lastUpdate = sharing
          ? "Actualizado hace unos segundos"
          : "Pausado por el usuario";
      });
  });

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
  const creator = users.find((user) => user.id === Number(createdBy));
  const nextGroup = {
    id: groups.length ? Math.max(...groups.map((group) => group.id)) + 1 : 1,
    name,
    description,
    createdBy,
    members: creator
      ? [
          {
            id: 1,
            userId: creator.id,
            fullName: creator.fullName,
            email: creator.email,
            phone: creator.phone,
            cedula: creator.cedula,
            relation: "Yo",
            locationStatus: creator.sharingLocation ? "sharing" : "paused",
            lastLocation: getLocationByUserId(creator.id)?.sector || "Sin ubicacion",
            lastUpdate: creator.lastConnection,
            top: "38%",
            left: "54%"
          }
        ]
      : []
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

export const removeMemberFromGroup = (groupId, userId) => {
  const group = getGroupById(groupId);
  if (!group) return null;

  const index = group.members.findIndex(
    (member) =>
      member.userId === Number(userId) ||
      (member.userId == null && member.id === Number(userId))
  );

  if (index < 0) return null;
  return group.members.splice(index, 1)[0];
};

export const updateLiveLocation = (userId, payload) => {
  const numericUserId = Number(userId);
  const now = new Date().toISOString();
  const existing = locations.find(
    (location) =>
      location.userId === numericUserId &&
      (payload.groupId == null || location.groupId === payload.groupId)
  );
  const nextLocation = {
    id: existing?.id || (locations.length ? Math.max(...locations.map((item) => item.id || 0)) + 1 : 1),
    userId: numericUserId,
    groupId: payload.groupId,
    city: "Quito",
    sector: payload.sector || "Ubicacion GPS",
    address: payload.address || "",
    latitude: payload.latitude,
    longitude: payload.longitude,
    accuracy: payload.accuracy,
    heading: payload.heading,
    speed: payload.speed,
    sharing: true,
    simulated: false,
    updatedAt: now,
    lastUpdate: now
  };

  if (existing) {
    Object.assign(existing, nextLocation);
  } else {
    locations.push(nextLocation);
  }

  const user = users.find((item) => item.id === numericUserId);
  if (user) {
    user.sharingLocation = true;
    user.active = true;
    user.lastConnection = now;
  }

  groups.forEach((group) => {
    group.members
      .filter((member) => member.userId === numericUserId || member.email === user?.email)
      .forEach((member) => {
        member.locationStatus = "sharing";
        member.lastLocation = nextLocation.address || `${nextLocation.latitude.toFixed(5)}, ${nextLocation.longitude.toFixed(5)}`;
        member.lastUpdate = now;
        member.latitude = nextLocation.latitude;
        member.longitude = nextLocation.longitude;
      });
  });

  return existing || nextLocation;
};

export const getLocationsByGroupId = (groupId) => {
  const group = getGroupById(groupId);
  if (!group) return [];

  return group.members.map((member) => {
    const user = users.find(
      (item) => item.id === member.userId || item.email === member.email
    );
    const location = user ? getLocationByUserAndGroupId(user.id, group.id) : null;

    return {
      userId: user?.id || member.userId || null,
      fullName: member.fullName,
      relation: member.relation,
      locationStatus: user?.sharingLocation ? "sharing" : member.locationStatus || "paused",
      sharing: Boolean(user?.sharingLocation),
      latitude: location?.latitude ?? member.latitude ?? null,
      longitude: location?.longitude ?? member.longitude ?? null,
      accuracy: location?.accuracy ?? null,
      address: location?.address || member.lastLocation || "",
      sector: location?.sector || member.lastLocation || "",
      updatedAt: location?.updatedAt || location?.lastUpdate || member.lastUpdate || null,
      simulated: location?.simulated ?? true
    };
  });
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
