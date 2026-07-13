import { groups, locations, users } from "./mockData.js";
import { Group } from "../models/Group.js";
import { GroupMember } from "../models/GroupMember.js";
import { Location } from "../models/Location.js";
import { User } from "../models/User.js";

const toDate = (value) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const upsertDocument = async (Model, query, payload) => {
  const existing = await Model.findOne(query);

  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return { created: false, document: existing };
  }

  return { created: true, document: await Model.create(payload) };
};

export const seedLocalMongoData = async () => {
  const summary = {
    users: { created: 0, updated: 0 },
    groups: { created: 0, updated: 0 },
    members: { created: 0, updated: 0 },
    locations: { created: 0, updated: 0 }
  };

  for (const user of users) {
    const result = await upsertDocument(
      User,
      { $or: [{ id: user.id }, { email: user.email }] },
      {
        ...user,
        lastConnection: toDate(user.lastConnection)
      }
    );
    summary.users[result.created ? "created" : "updated"] += 1;
  }

  for (const group of groups) {
    const { members, ...groupPayload } = group;
    const result = await upsertDocument(Group, { id: group.id }, groupPayload);
    summary.groups[result.created ? "created" : "updated"] += 1;

    for (const member of members) {
      const memberResult = await upsertDocument(
        GroupMember,
        { $or: [{ groupId: group.id, id: member.id }, { groupId: group.id, email: member.email }] },
        { ...member, groupId: group.id }
      );
      summary.members[memberResult.created ? "created" : "updated"] += 1;
    }
  }

  for (const location of locations) {
    const result = await upsertDocument(
      Location,
      { id: location.id },
      {
        ...location,
        lastUpdate: toDate(location.lastUpdate || location.updatedAt)
      }
    );
    summary.locations[result.created ? "created" : "updated"] += 1;
  }

  return summary;
};
