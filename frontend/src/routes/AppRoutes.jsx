import React from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import AdminAlerts from "../pages/admin/AdminAlerts.jsx";
import AdminApi from "../pages/admin/AdminApi.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminGroups from "../pages/admin/AdminGroups.jsx";
import AdminMap from "../pages/admin/AdminMap.jsx";
import AdminPeople from "../pages/admin/AdminPeople.jsx";
import Home from "../pages/Home.jsx";
import LocalEndpointsPanel from "../pages/LocalEndpointsPanel.jsx";
import Login from "../pages/Login.jsx";
import NotFound from "../pages/NotFound.jsx";
import PersonaApi from "../pages/persona/PersonaApi.jsx";
import PersonaDashboard from "../pages/persona/PersonaDashboard.jsx";
import PersonaGroups from "../pages/persona/PersonaGroups.jsx";
import PersonaLocation from "../pages/persona/PersonaLocation.jsx";
import PersonaPrivacy from "../pages/persona/PersonaPrivacy.jsx";
import Register from "../pages/Register.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence initial={false} mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<Navigate replace to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/personas" element={<AdminPeople />} />
            <Route path="/admin/grupos" element={<AdminGroups />} />
            <Route path="/admin/mapa" element={<AdminMap />} />
            <Route path="/admin/alertas" element={<AdminAlerts />} />
            <Route path="/admin/api" element={<AdminApi />} />
            <Route path="/admin/endpoints-locales" element={<LocalEndpointsPanel />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["persona"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/persona" element={<Navigate replace to="/persona/dashboard" />} />
            <Route path="/persona/dashboard" element={<PersonaDashboard />} />
            <Route path="/persona/ubicacion" element={<PersonaLocation />} />
            <Route path="/persona/grupos" element={<PersonaGroups />} />
            <Route path="/persona/privacidad" element={<PersonaPrivacy />} />
            <Route path="/persona/api" element={<PersonaApi />} />
            <Route path="/persona/endpoints-locales" element={<LocalEndpointsPanel />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
