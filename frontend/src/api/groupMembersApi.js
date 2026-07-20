import api from "./api.js";

export const removeGroupMember = async (groupId, memberId) => {
  const { data } = await api.delete(`/groups/${groupId}/members/${memberId}`);
  return data;
};

export const leaveGroup = async (groupId) => {
  const { data } = await api.delete(`/groups/${groupId}/members/me`);
  return data;
};
