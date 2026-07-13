import {
  addMemberToGroup,
  createGroup as createMemoryGroup,
  getGroupById,
  getLocationByUserId,
  getLocationsByGroupId,
  getVisibleGroups,
  groups,
  locations,
  updateLiveLocation,
  updateLocationSharing,
  users
} from "../data/mockData.js";
import {
  isSupabaseConfigured,
  supabaseRequest,
  verifySupabaseConnection
} from "../config/supabase.js";
import {
  connectMongoDB,
  disconnectMongoDB,
  isMongoConfigured
} from "../config/database.js";
import { Group } from "../models/Group.js";
import { GroupMember } from "../models/GroupMember.js";
import { Location } from "../models/Location.js";
import { User } from "../models/User.js";

let activeMode = "memory";

const cleanMongoDocument = (document) => {
  if (!document) return null;
  const value = document?.toObject ? document.toObject() : { ...document };
  delete value._id;
  delete value.__v;
  return value;
};

const normalizeMongoLocation = (row) => {
  if (!row) return null;
  const location = cleanMongoDocument(row);
  const updatedAt = location.lastUpdate || location.updatedAt;
  return { ...location, updatedAt, lastUpdate: updatedAt };
};

const nextMongoId = async (Model, filter = {}) => {
  const latest = await Model.findOne(filter).sort({ id: -1 }).select({ id: 1 }).lean();
  return (latest?.id || 0) + 1;
};

const seedMongoDB = async () => {
  if ((await User.countDocuments()) === 0) {
    await User.insertMany(
      users.map((user) => ({
        ...user,
        lastConnection: new Date(user.lastConnection || Date.now())
      }))
    );
  }

  if ((await Group.countDocuments()) === 0) {
    await Group.insertMany(
      groups.map(({ members, ...group }) => group)
    );
  }

  if ((await GroupMember.countDocuments()) === 0) {
    await GroupMember.insertMany(
      groups.flatMap((group) =>
        group.members.map((member) => ({ ...member, groupId: group.id }))
      )
    );
  }

  if ((await Location.countDocuments()) === 0) {
    await Location.insertMany(
      locations.map((location) => ({
        ...location,
        lastUpdate: new Date(location.updatedAt || location.lastUpdate || Date.now())
      }))
    );
  }
};

const fromProfile = (row) => ({
  id: Number(row.id),
  fullName: row.full_name,
  email: row.email,
  password: row.password,
  role: row.role,
  language: row.language,
  cedula: row.cedula,
  phone: row.phone,
  active: row.active,
  sharingLocation: row.sharing_location,
  lastConnection: row.last_connection,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const toProfile = (user) => ({
  full_name: user.fullName,
  email: user.email,
  password: user.password,
  role: user.role,
  language: user.language,
  cedula: user.cedula,
  phone: user.phone,
  active: Boolean(user.active),
  sharing_location: Boolean(user.sharingLocation),
  last_connection: user.lastConnection
});

const toProfileUpdate = (data) => {
  const fieldMap = {
    fullName: "full_name",
    email: "email",
    password: "password",
    role: "role",
    language: "language",
    cedula: "cedula",
    phone: "phone",
    active: "active",
    sharingLocation: "sharing_location",
    lastConnection: "last_connection"
  };
  return Object.fromEntries(
    Object.entries(data)
      .filter(([key, value]) => fieldMap[key] && value !== undefined)
      .map(([key, value]) => [fieldMap[key], value])
  );
};

const fromMember = (row) => ({
  id: Number(row.id),
  userId: row.user_id == null ? null : Number(row.user_id),
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  cedula: row.cedula,
  relation: row.relation,
  locationStatus: row.location_status,
  lastLocation: row.last_location,
  lastUpdate: row.last_update,
  top: row.marker_top,
  left: row.marker_left
});

const toMember = (groupId, member) => ({
  group_id: Number(groupId),
  user_id: member.userId == null ? null : Number(member.userId),
  full_name: member.fullName,
  email: member.email,
  phone: member.phone,
  cedula: member.cedula || null,
  relation: member.relation,
  location_status: member.locationStatus || "paused",
  last_location: member.lastLocation || "Sin ubicacion",
  last_update: member.lastUpdate || new Date().toISOString(),
  marker_top: member.top || "50%",
  marker_left: member.left || "50%"
});

const fromLocation = (row) => ({
  id: Number(row.id),
  userId: Number(row.user_id),
  groupId: row.group_id == null ? null : Number(row.group_id),
  city: row.city || "Quito",
  latitude: row.latitude,
  longitude: row.longitude,
  accuracy: row.accuracy,
  heading: row.heading,
  speed: row.speed,
  sharing: row.sharing,
  address: row.address || "",
  sector: row.sector || "Ubicacion GPS",
  updatedAt: row.updated_at,
  lastUpdate: row.updated_at,
  simulated: false
});

const getSupabaseMembers = async (groupId) => {
  const rows = await supabaseRequest(
    `group_members?select=*&group_id=eq.${Number(groupId)}&order=id.asc`
  );
  return rows.map(fromMember);
};

const fromSupabaseGroup = async (row) => ({
  id: Number(row.id),
  name: row.name,
  description: row.description || "",
  createdBy: Number(row.created_by),
  members: await getSupabaseMembers(row.id),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const getMongoGroup = async (row) => {
  if (!row) return null;
  const group = cleanMongoDocument(row);
  const members = await GroupMember.find({ groupId: group.id }).sort({ id: 1 }).lean();
  return { ...group, members: members.map(cleanMongoDocument) };
};

const filterVisibleGroups = (allGroups, user) => {
  if (user.role === "admin") return allGroups;
  return allGroups.filter(
    (group) =>
      group.createdBy === user.id ||
      group.members.some(
        (member) => member.userId === user.id || member.email === user.email
      )
  );
};

const filterVisibleLocations = async (allLocations, user, listGroups) => {
  if (user.role === "admin") return allLocations;
  const visibleUserIds = new Set([user.id]);
  (await listGroups(user)).forEach((group) =>
    group.members.forEach((member) => member.userId && visibleUserIds.add(member.userId))
  );
  return allLocations.filter((location) => visibleUserIds.has(location.userId));
};

export const databaseService = {
  get mode() {
    return activeMode;
  },

  async initialize() {
    if (isMongoConfigured()) {
      try {
        await connectMongoDB();
        await seedMongoDB();
        activeMode = "mongodb";
        console.log("MongoDB conectado. Persistencia principal activa.");
        return activeMode;
      } catch (error) {
        console.warn(`MongoDB no disponible: ${error.message}`);
        await disconnectMongoDB().catch(() => undefined);
      }
    } else {
      console.log("MongoDB no configurado.");
    }

    if (isSupabaseConfigured) {
      try {
        await verifySupabaseConnection();
        activeMode = "supabase";
        console.log("Supabase conectado como almacenamiento alternativo.");
        return activeMode;
      } catch (error) {
        console.warn(`Supabase no disponible: ${error.message}`);
      }
    }

    activeMode = "memory";
    console.log("Supabase no configurado. Usando almacenamiento en memoria.");
    return activeMode;
  },

  async listUsers() {
    if (activeMode === "mongodb") {
      return (await User.find().sort({ id: 1 }).lean()).map(cleanMongoDocument);
    }
    if (activeMode === "memory") return users;
    const rows = await supabaseRequest("profiles?select=*&order=id.asc");
    return rows.map(fromProfile);
  },

  async getUserById(userId) {
    const id = Number(userId);
    if (activeMode === "mongodb") return cleanMongoDocument(await User.findOne({ id }).lean());
    if (activeMode === "memory") return users.find((user) => user.id === id) || null;
    const rows = await supabaseRequest(`profiles?select=*&id=eq.${id}&limit=1`);
    return rows[0] ? fromProfile(rows[0]) : null;
  },

  async getUserByEmail(email) {
    const normalizedEmail = String(email).toLowerCase();
    if (activeMode === "mongodb") {
      return cleanMongoDocument(await User.findOne({ email: normalizedEmail }).lean());
    }
    if (activeMode === "memory") {
      return users.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
    }
    const rows = await supabaseRequest(
      `profiles?select=*&email=eq.${encodeURIComponent(normalizedEmail)}&limit=1`
    );
    return rows[0] ? fromProfile(rows[0]) : null;
  },

  async createUser(user) {
    if (activeMode === "mongodb") {
      const created = await User.create({ id: await nextMongoId(User), ...user });
      await Location.create({
        id: await nextMongoId(Location),
        userId: created.id,
        groupId: null,
        city: "Quito",
        latitude: -0.2032,
        longitude: -78.4907,
        sharing: false,
        simulated: true,
        sector: "La Mariscal"
      });
      return cleanMongoDocument(created);
    }
    if (activeMode === "memory") {
      const created = { id: users.length ? Math.max(...users.map((item) => item.id)) + 1 : 1, ...user };
      users.push(created);
      locations.push({
        id: locations.length ? Math.max(...locations.map((item) => item.id || 0)) + 1 : 1,
        userId: created.id,
        groupId: null,
        city: "Quito",
        sector: "La Mariscal",
        latitude: -0.2032,
        longitude: -78.4907,
        sharing: false,
        simulated: true,
        lastUpdate: new Date().toISOString()
      });
      return created;
    }
    const rows = await supabaseRequest("profiles", {
      method: "POST",
      body: toProfile(user),
      prefer: "return=representation"
    });
    const created = fromProfile(rows[0]);
    await supabaseRequest("locations", {
      method: "POST",
      body: {
        user_id: created.id,
        group_id: null,
        city: "Quito",
        latitude: -0.2032,
        longitude: -78.4907,
        sharing: false,
        sector: "La Mariscal"
      }
    });
    return created;
  },

  async updateUser(userId, data) {
    const id = Number(userId);
    if (activeMode === "mongodb") {
      return cleanMongoDocument(
        await User.findOneAndUpdate({ id }, { $set: data }, { new: true, runValidators: true }).lean()
      );
    }
    if (activeMode === "memory") {
      const user = users.find((item) => item.id === id);
      if (!user) return null;
      Object.assign(user, data);
      return user;
    }
    const rows = await supabaseRequest(`profiles?id=eq.${id}`, {
      method: "PATCH",
      body: toProfileUpdate(data),
      prefer: "return=representation"
    });
    return rows[0] ? fromProfile(rows[0]) : null;
  },

  async deleteUser(userId) {
    const id = Number(userId);
    if (activeMode === "mongodb") {
      const deleted = await User.findOneAndDelete({ id }).lean();
      if (!deleted) return null;
      const ownedGroups = await Group.find({ createdBy: id }).select({ id: 1 }).lean();
      const ownedIds = ownedGroups.map((group) => group.id);
      await Promise.all([
        Group.deleteMany({ createdBy: id }),
        GroupMember.deleteMany({ $or: [{ userId: id }, { groupId: { $in: ownedIds } }] }),
        Location.deleteMany({ $or: [{ userId: id }, { groupId: { $in: ownedIds } }] })
      ]);
      return cleanMongoDocument(deleted);
    }
    if (activeMode === "memory") {
      const index = users.findIndex((item) => item.id === id);
      if (index < 0) return null;
      const [deleted] = users.splice(index, 1);
      for (let i = locations.length - 1; i >= 0; i -= 1) {
        if (locations[i].userId === id) locations.splice(i, 1);
      }
      groups.forEach((group) => {
        group.members = group.members.filter((member) => member.userId !== id);
      });
      return deleted;
    }
    const rows = await supabaseRequest(`profiles?id=eq.${id}`, {
      method: "DELETE",
      prefer: "return=representation"
    });
    return rows[0] ? fromProfile(rows[0]) : null;
  },

  async listGroups(user) {
    if (activeMode === "mongodb") {
      const rows = await Group.find().sort({ id: 1 }).lean();
      return filterVisibleGroups(await Promise.all(rows.map(getMongoGroup)), user);
    }
    if (activeMode === "memory") return getVisibleGroups(user);
    const rows = await supabaseRequest("groups?select=*&order=id.asc");
    return filterVisibleGroups(await Promise.all(rows.map(fromSupabaseGroup)), user);
  },

  async getGroup(groupId) {
    const id = Number(groupId);
    if (activeMode === "mongodb") return getMongoGroup(await Group.findOne({ id }).lean());
    if (activeMode === "memory") return getGroupById(id) || null;
    const rows = await supabaseRequest(`groups?select=*&id=eq.${id}&limit=1`);
    return rows[0] ? fromSupabaseGroup(rows[0]) : null;
  },

  async createGroup(data) {
    if (activeMode === "mongodb") {
      const created = await Group.create({ id: await nextMongoId(Group), ...data });
      const creator = await this.getUserById(data.createdBy);
      if (creator) {
        await GroupMember.create({
          id: 1,
          groupId: created.id,
          userId: creator.id,
          fullName: creator.fullName,
          email: creator.email,
          phone: creator.phone,
          cedula: creator.cedula,
          relation: "Yo",
          locationStatus: creator.sharingLocation ? "sharing" : "paused"
        });
      }
      return getMongoGroup(created);
    }
    if (activeMode === "memory") return createMemoryGroup(data);
    const rows = await supabaseRequest("groups", {
      method: "POST",
      body: { name: data.name, description: data.description, created_by: data.createdBy },
      prefer: "return=representation"
    });
    const creator = await this.getUserById(data.createdBy);
    if (creator) {
      await supabaseRequest("group_members", {
        method: "POST",
        body: toMember(rows[0].id, {
          userId: creator.id,
          fullName: creator.fullName,
          email: creator.email,
          phone: creator.phone,
          cedula: creator.cedula,
          relation: "Yo",
          locationStatus: creator.sharingLocation ? "sharing" : "paused"
        })
      });
    }
    return fromSupabaseGroup(rows[0]);
  },

  async updateGroup(groupId, data) {
    const id = Number(groupId);
    if (activeMode === "mongodb") {
      return getMongoGroup(
        await Group.findOneAndUpdate({ id }, { $set: data }, { new: true, runValidators: true }).lean()
      );
    }
    if (activeMode === "memory") {
      const group = getGroupById(id);
      if (!group) return null;
      Object.assign(group, data);
      return group;
    }
    const rows = await supabaseRequest(`groups?id=eq.${id}`, {
      method: "PATCH",
      body: data,
      prefer: "return=representation"
    });
    return rows[0] ? fromSupabaseGroup(rows[0]) : null;
  },

  async deleteGroup(groupId) {
    const id = Number(groupId);
    if (activeMode === "mongodb") {
      const deleted = await Group.findOneAndDelete({ id }).lean();
      if (!deleted) return null;
      await Promise.all([
        GroupMember.deleteMany({ groupId: id }),
        Location.deleteMany({ groupId: id })
      ]);
      return cleanMongoDocument(deleted);
    }
    if (activeMode === "memory") {
      const index = groups.findIndex((group) => group.id === id);
      if (index < 0) return null;
      const deleted = groups.splice(index, 1)[0];
      for (let i = locations.length - 1; i >= 0; i -= 1) {
        if (locations[i].groupId === id) locations.splice(i, 1);
      }
      return deleted;
    }
    const rows = await supabaseRequest(`groups?id=eq.${id}`, {
      method: "DELETE",
      prefer: "return=representation"
    });
    return rows[0] ? { id: Number(rows[0].id), name: rows[0].name } : null;
  },

  async listMembers(groupId) {
    const id = Number(groupId);
    if (activeMode === "mongodb") {
      return (await GroupMember.find({ groupId: id }).sort({ id: 1 }).lean()).map(cleanMongoDocument);
    }
    if (activeMode === "memory") return getGroupById(id)?.members || [];
    return getSupabaseMembers(id);
  },

  async addMember(groupId, member) {
    const id = Number(groupId);
    if (activeMode === "mongodb") {
      const created = await GroupMember.create({
        id: await nextMongoId(GroupMember, { groupId: id }),
        groupId: id,
        ...member
      });
      return cleanMongoDocument(created);
    }
    if (activeMode === "memory") return addMemberToGroup(id, member);
    const rows = await supabaseRequest("group_members", {
      method: "POST",
      body: toMember(id, member),
      prefer: "return=representation"
    });
    return fromMember(rows[0]);
  },

  async updateMember(groupId, memberId, data) {
    const group = Number(groupId);
    const id = Number(memberId);
    if (activeMode === "mongodb") {
      return cleanMongoDocument(
        await GroupMember.findOneAndUpdate(
          { groupId: group, id },
          { $set: data },
          { new: true, runValidators: true }
        ).lean()
      );
    }
    if (activeMode === "memory") {
      const member = getGroupById(group)?.members.find((item) => item.id === id);
      if (!member) return null;
      Object.assign(member, data);
      return member;
    }
    const body = {};
    if (data.relation !== undefined) body.relation = data.relation;
    if (data.locationStatus !== undefined) body.location_status = data.locationStatus;
    if (data.lastUpdate !== undefined) body.last_update = data.lastUpdate;
    const rows = await supabaseRequest(
      `group_members?group_id=eq.${group}&id=eq.${id}`,
      { method: "PATCH", body, prefer: "return=representation" }
    );
    return rows[0] ? fromMember(rows[0]) : null;
  },

  async deleteMember(groupId, memberId) {
    const group = Number(groupId);
    const id = Number(memberId);
    if (activeMode === "mongodb") {
      return cleanMongoDocument(await GroupMember.findOneAndDelete({ groupId: group, id }).lean());
    }
    if (activeMode === "memory") {
      const target = getGroupById(group);
      const index = target?.members.findIndex((member) => member.id === id) ?? -1;
      return index >= 0 ? target.members.splice(index, 1)[0] : null;
    }
    const rows = await supabaseRequest(
      `group_members?group_id=eq.${group}&id=eq.${id}`,
      { method: "DELETE", prefer: "return=representation" }
    );
    return rows[0] ? fromMember(rows[0]) : null;
  },

  async listLocations(user) {
    if (activeMode === "mongodb") {
      const all = (await Location.find().sort({ lastUpdate: -1 }).lean()).map(normalizeMongoLocation);
      return filterVisibleLocations(all, user, this.listGroups.bind(this));
    }
    if (activeMode === "memory") {
      return filterVisibleLocations(locations, user, async (currentUser) => getVisibleGroups(currentUser));
    }
    const rows = await supabaseRequest("locations?select=*&order=updated_at.desc");
    return filterVisibleLocations(rows.map(fromLocation), user, this.listGroups.bind(this));
  },

  async getLocationById(locationId) {
    const id = Number(locationId);
    if (activeMode === "mongodb") return normalizeMongoLocation(await Location.findOne({ id }).lean());
    if (activeMode === "memory") return locations.find((location) => location.id === id) || null;
    const rows = await supabaseRequest(`locations?select=*&id=eq.${id}&limit=1`);
    return rows[0] ? fromLocation(rows[0]) : null;
  },

  async getUserLocation(userId) {
    const id = Number(userId);
    if (activeMode === "mongodb") {
      return normalizeMongoLocation(await Location.findOne({ userId: id }).sort({ lastUpdate: -1 }).lean());
    }
    if (activeMode === "memory") return getLocationByUserId(id);
    const rows = await supabaseRequest(
      `locations?select=*&user_id=eq.${id}&order=updated_at.desc&limit=1`
    );
    return rows[0] ? fromLocation(rows[0]) : null;
  },

  async getGroupLocations(groupId) {
    const id = Number(groupId);
    if (activeMode === "memory") return getLocationsByGroupId(id);
    const group = await this.getGroup(id);
    if (!group) return [];
    return Promise.all(
      group.members.map(async (member) => {
        let location = null;
        if (member.userId) {
          if (activeMode === "mongodb") {
            const row = await Location.findOne({
              userId: member.userId,
              $or: [{ groupId: id }, { groupId: null }]
            }).sort({ groupId: -1, lastUpdate: -1 }).lean();
            location = row ? normalizeMongoLocation(row) : null;
          } else {
            const exactRows = await supabaseRequest(
              `locations?select=*&user_id=eq.${member.userId}&group_id=eq.${id}&order=updated_at.desc&limit=1`
            );
            location = exactRows[0] ? fromLocation(exactRows[0]) : null;
          }
        }
        return {
          ...location,
          userId: member.userId,
          fullName: member.fullName,
          relation: member.relation,
          locationStatus: location?.sharing ? "sharing" : member.locationStatus,
          sharing: Boolean(location?.sharing),
          address: location?.address || member.lastLocation || "",
          sector: location?.sector || member.lastLocation || "",
          updatedAt: location?.updatedAt || member.lastUpdate,
          simulated: location?.simulated ?? activeMode !== "mongodb"
        };
      })
    );
  },

  async saveLocation(data) {
    if (activeMode === "mongodb") {
      const existing = await Location.findOne({
        userId: Number(data.userId),
        groupId: data.groupId == null ? null : Number(data.groupId)
      });
      const payload = {
        ...data,
        userId: Number(data.userId),
        groupId: data.groupId == null ? null : Number(data.groupId),
        city: data.city || "Quito",
        lastUpdate: new Date(),
        simulated: false
      };
      const saved = existing
        ? await Location.findOneAndUpdate(
            { id: existing.id },
            { $set: payload },
            { new: true, runValidators: true }
          )
        : await Location.create({ id: await nextMongoId(Location), ...payload });
      await this.setUserSharing(data.userId, data.sharing);
      return normalizeMongoLocation(saved);
    }
    if (activeMode === "memory") {
      const location = updateLiveLocation(data.userId, data);
      updateLocationSharing(data.userId, data.sharing);
      location.sharing = data.sharing;
      return location;
    }
    const groupFilter = data.groupId == null ? "group_id=is.null" : `group_id=eq.${data.groupId}`;
    const existing = await supabaseRequest(
      `locations?select=id&user_id=eq.${data.userId}&${groupFilter}&limit=1`
    );
    const body = {
      user_id: data.userId,
      group_id: data.groupId,
      city: data.city || "Quito",
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      heading: data.heading,
      speed: data.speed,
      sharing: data.sharing,
      address: data.address,
      sector: data.sector,
      updated_at: new Date().toISOString()
    };
    const rows = await supabaseRequest(existing[0] ? `locations?id=eq.${existing[0].id}` : "locations", {
      method: existing[0] ? "PATCH" : "POST",
      body,
      prefer: "return=representation"
    });
    await this.setUserSharing(data.userId, data.sharing);
    return fromLocation(rows[0]);
  },

  async updateLocation(locationId, data) {
    const id = Number(locationId);
    if (activeMode === "mongodb") {
      return normalizeMongoLocation(
        await Location.findOneAndUpdate(
          { id },
          { $set: { ...data, lastUpdate: new Date() } },
          { new: true, runValidators: true }
        ).lean()
      );
    }
    if (activeMode === "memory") {
      const location = locations.find((item) => item.id === id);
      if (!location) return null;
      Object.assign(location, data, { lastUpdate: new Date().toISOString() });
      return location;
    }
    const body = {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      heading: data.heading,
      speed: data.speed,
      sharing: data.sharing,
      address: data.address,
      sector: data.sector,
      updated_at: new Date().toISOString()
    };
    Object.keys(body).forEach((key) => body[key] === undefined && delete body[key]);
    const rows = await supabaseRequest(`locations?id=eq.${id}`, {
      method: "PATCH",
      body,
      prefer: "return=representation"
    });
    return rows[0] ? fromLocation(rows[0]) : null;
  },

  async deleteLocation(locationId) {
    const id = Number(locationId);
    if (activeMode === "mongodb") {
      return normalizeMongoLocation(await Location.findOneAndDelete({ id }).lean());
    }
    if (activeMode === "memory") {
      const index = locations.findIndex((item) => item.id === id);
      return index >= 0 ? locations.splice(index, 1)[0] : null;
    }
    const rows = await supabaseRequest(`locations?id=eq.${id}`, {
      method: "DELETE",
      prefer: "return=representation"
    });
    return rows[0] ? fromLocation(rows[0]) : null;
  },

  async setUserSharing(userId, sharing) {
    const id = Number(userId);
    const now = new Date();
    if (activeMode === "mongodb") {
      const user = await User.findOneAndUpdate(
        { id },
        { $set: { sharingLocation: sharing, active: sharing, lastConnection: now } },
        { new: true }
      ).lean();
      if (!user) return null;
      await Promise.all([
        Location.updateMany({ userId: id }, { $set: { sharing, lastUpdate: now } }),
        GroupMember.updateMany(
          { $or: [{ userId: id }, { email: user.email }] },
          {
            $set: {
              locationStatus: sharing ? "sharing" : "paused",
              lastUpdate: sharing ? now.toISOString() : "Pausado por el usuario"
            }
          }
        )
      ]);
      return cleanMongoDocument(user);
    }
    if (activeMode === "memory") return updateLocationSharing(id, sharing);
    const rows = await supabaseRequest(`profiles?id=eq.${id}`, {
      method: "PATCH",
      body: {
        sharing_location: sharing,
        active: sharing,
        last_connection: now.toISOString()
      },
      prefer: "return=representation"
    });
    await supabaseRequest(`locations?user_id=eq.${id}`, {
      method: "PATCH",
      body: { sharing, updated_at: now.toISOString() }
    });
    return rows[0] ? fromProfile(rows[0]) : null;
  }
};
