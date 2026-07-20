import {
  BellRing,
  Headphones,
  Home,
  Info,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  UsersRound,
  UserRound,
  ScrollText
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
      { to: "/admin/bitacora", label: "Bitacora", icon: ScrollText },
      { to: "/admin/perfil", label: "Perfil", icon: UserRound },
      { to: "/admin/soporte", label: "Soporte", icon: Headphones },
      { to: "/admin/acerca", label: "Acerca de nosotros", icon: Info }
    ];
  }

  return [
    { to: "/", label: t("sidebar.home"), icon: Home },
    { to: "/persona/dashboard", label: t("sidebar.myPanel"), icon: UserRound },
    { to: "/persona/ubicacion", label: t("sidebar.myLocation"), icon: MapPin },
    { to: "/persona/grupos", label: t("sidebar.groups"), icon: UsersRound },
    { to: "/persona/alertas", label: t("sidebar.alerts"), icon: BellRing },
    { to: "/persona/bitacora", label: "Bitacora", icon: ScrollText },
    { to: "/persona/privacidad", label: t("sidebar.privacy"), icon: ShieldCheck },
    { to: "/persona/perfil", label: "Perfil", icon: UserRound },
    { to: "/persona/soporte", label: "Soporte", icon: Headphones },
    { to: "/persona/acerca", label: "Acerca de nosotros", icon: Info }
  ];
};
