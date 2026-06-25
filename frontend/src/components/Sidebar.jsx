import React from "react";
import {
  BellRing,
  Code2,
  LayoutDashboard,
  LogOut,
  MapPinned,
  MapPin,
  Radar,
  ShieldCheck,
  UsersRound,
  UserRound
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import Button from "./Button.jsx";

const getLinks = (role, t) => {
  if (role === "admin") {
    return [
      { to: "/admin/dashboard", label: t("sidebar.adminPanel"), icon: LayoutDashboard },
      { to: "/admin/dashboard#personas", label: t("sidebar.people"), icon: UsersRound },
      { to: "/admin/dashboard#grupos", label: t("sidebar.groups"), icon: UsersRound },
      { to: "/admin/dashboard#mapa", label: t("sidebar.map"), icon: MapPin },
      { to: "/admin/dashboard#alertas", label: t("sidebar.alerts"), icon: BellRing },
      { to: "/admin/api", label: t("sidebar.api"), icon: Code2 }
    ];
  }

  return [
    { to: "/persona/dashboard", label: t("sidebar.myPanel"), icon: UserRound },
    { to: "/persona/dashboard#ubicacion", label: t("sidebar.myLocation"), icon: MapPin },
    { to: "/persona/dashboard#grupos", label: t("sidebar.myGroup"), icon: UsersRound },
    { to: "/persona/dashboard#privacidad", label: t("sidebar.privacy"), icon: ShieldCheck },
    { to: "/persona/dashboard#circulo", label: t("sidebar.familyCircle"), icon: UsersRound }
  ];
};

const Sidebar = () => {
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="border-b border-[var(--color-border)] bg-[var(--color-card)] lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-950 p-4 text-white shadow-soft">
          <span className="rounded-lg bg-[var(--color-primary)] p-2 shadow-glow">
            <MapPinned className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{t("app.shortName")}</p>
            <p className="text-xs text-slate-300">{t("app.demo")}</p>
          </div>
        </div>

        <nav className="mt-4 grid gap-2">
          {getLinks(user?.role, t).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--color-soft)] text-[var(--color-primary)]"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-soft)] hover:text-[var(--color-text)]"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 grid gap-3 lg:mt-auto">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4 text-sm text-[var(--color-text)]">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
              {t("sidebar.session")}
            </div>
            <p className="truncate">{user?.fullName}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-muted)]">
              {t("sidebar.role", { role: user?.role })}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-3 text-xs text-[var(--color-muted)]">
            <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
              <Radar className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              {t("sidebar.demoData")}
            </div>
            <p className="mt-1 leading-5">{t("sidebar.demoText")}</p>
          </div>

          <Button className="w-full" icon={LogOut} variant="secondary" onClick={handleLogout}>
            {t("sidebar.logout")}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
