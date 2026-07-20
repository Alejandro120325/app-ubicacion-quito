export type Role = "admin" | "persona";

export type LocationStatus = "sharing" | "paused" | "offline";

export type User = {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  language: string;
  cedula: string;
  phone: string;
  active: boolean;
  sharingLocation: boolean;
  lastConnection: string;
  lastLocation?: SimulatedLocation | null;
};

export type SimulatedLocation = {
  userId: number;
  city: string;
  sector: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  address?: string;
  lastUpdate: string;
  sharing?: boolean;
  simulated?: boolean;
};

export type GroupMember = {
  id: number;
  userId?: number | null;
  fullName: string;
  email: string;
  phone: string;
  cedula: string;
  relation: string;
  locationStatus: LocationStatus;
  lastLocation: string;
  lastUpdate: string;
  accuracy?: number | null;
  address?: string;
  sector?: string;
  simulated?: boolean;
  top: string;
  left: string;
};

export type Group = {
  id: number;
  name: string;
  createdBy: number;
  description: string;
  members: GroupMember[];
};

export type Session = {
  token: string | null;
  user: User | null;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  language: string;
  cedula: string;
  phone: string;
};

export type MapPoint = {
  label: string;
  top: string;
  left: string;
  locationStatus?: LocationStatus;
  active?: boolean;
};
