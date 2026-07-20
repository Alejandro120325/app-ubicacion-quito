import { connectMongoDB } from "../config/database.js";
import { seedLocalMongoData } from "../data/seedLocalData.js";
import { Group } from "../models/Group.js";
import { GroupMember } from "../models/GroupMember.js";
import { Location } from "../models/Location.js";
import { User } from "../models/User.js";

let activeMode = "mongodb";

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
    group.members.forEach((member) => {
      if (member.userId) visibleUserIds.add(member.userId);
    })
  );

  return allLocations.filter((location) => visibleUserIds.has(location.userId));
};

const getLatestLocationForMember = async (member, groupId) => {
  let userId = member.userId;

  if (!userId && member.email) {
    const user = await User.findOne({ email: member.email }).select({ id: 1 }).lean();
    userId = user?.id || null;
  }

  if (!userId) return null;

  return normalizeMongoLocation(
    await Location.findOne({
      userId,
      $or: [{ groupId }, { groupId: null }]
    })
      .sort({ groupId: -1, lastUpdate: -1 })
      .lean()
  );
};

export const databaseService = {
  get mode() {
    return activeMode;
  },

  async initialize() {
    try {
      await connectMongoDB();
      await seedLocalMongoData();
      activeMode = "mongodb";
      console.log("MongoDB local conectado. Persistencia principal activa.");
      return activeMode;
    } catch (error) {
      throw new Error(
        `MongoDB local no disponible. Verifica mongodb://127.0.0.1:27017/geokipu. Detalle: ${error.message}`
      );
    }
  },

  async listUsers() {
    return (await User.find().sort({ id: 1 }).lean()).map(cleanMongoDocument);
  },

  async getUserById(userId) {
    return cleanMongoDocument(await User.findOne({ id: Number(userId) }).lean());
  },

  async getUserByEmail(email) {
    return cleanMongoDocument(
      await User.findOne({ email: String(email).toLowerCase() }).lean()
    );
  },

  async createUser(user) {
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
  },

  async updateUser(userId, data) {
    return cleanMongoDocument(
      await User.findOneAndUpdate(
        { id: Number(userId) },
        { $set: data },
        { new: true, runValidators: true }
      ).lean()
    );
  },

  async deleteUser(userId) {
    const id = Number(userId);
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
  },

  async listGroups(user) {
    const rows = await Group.find().sort({ id: 1 }).lean();
    return filterVisibleGroups(await Promise.all(rows.map(getMongoGroup)), user);
  },

  async getGroup(groupId) {
    return getMongoGroup(await Group.findOne({ id: Number(groupId) }).lean());
  },

  async createGroup(data) {
    const created = await Group.create({ id: await nextMongoId(Group), ...data });
    const creator = await this.getUserById(data.createdBy);

    if (creator) {
      const creatorLocation = await this.getUserLocation(creator.id);
      await GroupMember.create({
        id: await nextMongoId(GroupMember, { groupId: created.id }),
        groupId: created.id,
        userId: creator.id,
        fullName: creator.fullName,
        email: creator.email,
        phone: creator.phone,
        cedula: creator.cedula,
        relation: "Yo",
        locationStatus: creator.sharingLocation ? "sharing" : "paused",
        lastLocation: creatorLocation?.sector || "Sin ubicacion"
      });
    }

    return getMongoGroup(created);
  },

  async updateGroup(groupId, data) {
    return getMongoGroup(
      await Group.findOneAndUpdate(
        { id: Number(groupId) },
        { $set: data },
        { new: true, runValidators: true }
      ).lean()
    );
  },

  async deleteGroup(groupId) {
    const id = Number(groupId);
    const deleted = await Group.findOneAndDelete({ id }).lean();
    if (!deleted) return null;

    await Promise.all([
      GroupMember.deleteMany({ groupId: id }),
      Location.deleteMany({ groupId: id })
    ]);

    return cleanMongoDocument(deleted);
  },

  async listMembers(groupId) {
    return (await GroupMember.find({ groupId: Number(groupId) }).sort({ id: 1 }).lean()).map(
      cleanMongoDocument
    );
  },

  async addMember(groupId, member) {
    const id = Number(groupId);
    const created = await GroupMember.create({
      id: await nextMongoId(GroupMember, { groupId: id }),
      groupId: id,
      ...member
    });
    return cleanMongoDocument(created);
  },

  async updateMember(groupId, memberId, data) {
    return cleanMongoDocument(
      await GroupMember.findOneAndUpdate(
        { groupId: Number(groupId), id: Number(memberId) },
        { $set: data },
        { new: true, runValidators: true }
      ).lean()
    );
  },

  async deleteMember(groupId, memberId) {
    return cleanMongoDocument(
      await GroupMember.findOneAndDelete({
        groupId: Number(groupId),
        id: Number(memberId)
      }).lean()
    );
  },

  async listLocations(user) {
    const all = (await Location.find().sort({ lastUpdate: -1 }).lean()).map(
      normalizeMongoLocation
    );
    return filterVisibleLocations(all, user, this.listGroups.bind(this));
  },

  async getLocationById(locationId) {
    return normalizeMongoLocation(await Location.findOne({ id: Number(locationId) }).lean());
  },

  async getUserLocation(userId) {
    return normalizeMongoLocation(
      await Location.findOne({ userId: Number(userId) }).sort({ lastUpdate: -1 }).lean()
    );
  },

  async getGroupLocations(groupId) {
    const id = Number(groupId);
    const group = await this.getGroup(id);
    if (!group) return [];

    return Promise.all(
      group.members.map(async (member) => {
        const location = await getLatestLocationForMember(member, id);
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
          simulated: location?.simulated ?? true
        };
      })
    );
  },

  async saveLocation(data) {
    const userId = Number(data.userId);
    const groupId = data.groupId == null ? null : Number(data.groupId);
    const lastUpdate = data.timestamp ? new Date(data.timestamp) : new Date();
    const existing = await Location.findOne({ userId, groupId });
    const payload = {
      ...data,
      userId,
      groupId,
      city: data.city || "Quito",
      lastUpdate,
      simulated: data.simulated ?? false
    };
    const saved = existing
      ? await Location.findOneAndUpdate(
          { id: existing.id },
          { $set: payload },
          { new: true, runValidators: true }
        )
      : await Location.create({ id: await nextMongoId(Location), ...payload });

    const updatedUser = await this.setUserSharing(userId, Boolean(data.sharing));

    if (updatedUser) {
      await GroupMember.updateMany(
        { $or: [{ userId }, { email: updatedUser.email }] },
        {
          $set: {
            locationStatus: data.sharing ? "sharing" : "paused",
            lastLocation: payload.sector || payload.address || "Ubicacion GPS",
            lastUpdate: lastUpdate.toISOString()
          }
        }
      );
    }

    return normalizeMongoLocation(saved);
  },

  async updateLocation(locationId, data) {
    return normalizeMongoLocation(
      await Location.findOneAndUpdate(
        { id: Number(locationId) },
        { $set: { ...data, lastUpdate: new Date() } },
        { new: true, runValidators: true }
      ).lean()
    );
  },

  async deleteLocation(locationId) {
    return normalizeMongoLocation(
      await Location.findOneAndDelete({ id: Number(locationId) }).lean()
    );
  },

  async setUserSharing(userId, sharing) {
    const id = Number(userId);
    const now = new Date();
    const user = await User.findOneAndUpdate(
      { id },
      { $set: { sharingLocation: sharing, active: sharing, lastConnection: now } },
      { new: true, runValidators: true }
    ).lean();

    if (!user) return null;

    const locationUpdate = sharing ? { sharing } : { sharing, lastUpdate: now };

    await Promise.all([
      Location.updateMany({ userId: id }, { $set: locationUpdate }),
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
};
