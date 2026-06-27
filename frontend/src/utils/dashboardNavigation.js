import {
  BellRing,
  Code2,
  Home,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  UsersRound,
  UserRound
} from "lucide-react";

export const getDashboardLinks = (role, t) => {
  if (role === "admin") {
    return [
      { to: "/", label: t("sidebar.home"), icon: Home },
      { to: "/admin/dashboard", label: t("sidebar.adminPanel"), icon: LayoutDashboard },
      { to: "/admin/personas", label: t("sidebar.people"), icon: UsersRound },
      { to: "/admin/grupos", label: t("sidebar.groups"), icon: UsersRound },
      { to: "/admin/mapa", label: t("sidebar.map"), icon: MapPin },
      { to: "/admin/alertas", label: t("sidebar.alerts"), icon: BellRing },
      { to: "/admin/api", label: t("sidebar.api"), icon: Code2 }
    ];
  }

  return [
    { to: "/", label: t("sidebar.home"), icon: Home },
    { to: "/persona/dashboard", label: t("sidebar.myPanel"), icon: UserRound },
    { to: "/persona/ubicacion", label: t("sidebar.myLocation"), icon: MapPin },
    { to: "/persona/grupos", label: t("sidebar.groups"), icon: UsersRound },
    { to: "/persona/privacidad", label: t("sidebar.privacy"), icon: ShieldCheck },
    { to: "/persona/api", label: t("sidebar.api"), icon: Code2 }
  ];
};
