import { useCallback, useEffect, useState } from "react";

import { api } from "@/services/api";
import { fallbackGroups, fallbackPeople } from "@/data/mock-data";
import type { Group, SimulatedLocation, User } from "@/types";

type UsersResponse = {
  users: User[];
};

type GroupsResponse = {
  groups: Group[];
};

type MeResponse = {
  user: User;
};

type LocationResponse = {
  location: SimulatedLocation;
};

export function useAdminData() {
  const [people, setPeople] = useState<User[]>(fallbackPeople);
  const [groups, setGroups] = useState<Group[]>(fallbackGroups);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [usersData, groupsData] = await Promise.all([
        api.get<UsersResponse>("/users"),
        api.get<GroupsResponse>("/groups")
      ]);

      setPeople(usersData.users || fallbackPeople);
      setGroups(groupsData.groups || fallbackGroups);
    } catch (requestError) {
      setPeople(fallbackPeople);
      setGroups(fallbackGroups);
      setError(
        requestError instanceof Error
          ? `${requestError.message} Se muestra informacion de demostracion.`
          : "No fue posible cargar la informacion. Se muestra modo demostracion."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { error, groups, loading, people, reload: load };
}

export function usePersonaData(user: User | null, updateUser?: (user: User) => Promise<void>) {
  const [profile, setProfile] = useState<User | null>(user);
  const [groups, setGroups] = useState<Group[]>(fallbackGroups);
  const [location, setLocation] = useState<SimulatedLocation | null>(
    fallbackPeople[0]?.lastLocation || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [meData, locationData, groupsData] = await Promise.all([
        api.get<MeResponse>("/users/me"),
        api.get<LocationResponse>(`/location/${user.id}`),
        api.get<GroupsResponse>("/groups")
      ]);

      setProfile(meData.user);
      setLocation(locationData.location);
      setGroups(groupsData.groups || fallbackGroups);

      if (updateUser && JSON.stringify(user) !== JSON.stringify(meData.user)) {
        await updateUser(meData.user);
      }
    } catch (requestError) {
      setProfile(user);
      setGroups(fallbackGroups);
      setLocation(fallbackPeople.find((item) => item.email === user.email)?.lastLocation || fallbackPeople[0].lastLocation || null);
      setError(
        requestError instanceof Error
          ? `${requestError.message} Se muestra informacion de demostracion.`
          : "No fue posible cargar la informacion. Se muestra modo demostracion."
      );
    } finally {
      setLoading(false);
    }
  }, [updateUser, user]);

  useEffect(() => {
    load();
  }, [load]);

  return { error, groups, loading, location, profile, reload: load, setProfile };
}
