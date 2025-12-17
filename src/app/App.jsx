import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../admin/ProtectedRoute";
import PermissionGuard from "../admin/components/PermissionGuard";
import hasPermission from "../admin/helper/hasPermision";
import { useAuth } from "../hooks/AuthContext";

import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home/Home";
import ScrollTopButton from "../components/ScrollToTop/ScrollTopButton";

import AdminLayout from "../admin/AdminLayout";
import AuthLayout from "../admin/auth/AuthLayout";
import Dashboard from "../admin/Dashboard";
import UsersPanel from "../admin/pages/users/UserPanel";
import SettingsPage from "../admin/SettingsPage";
import Unauthorized from "../admin/Unauthorized";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  const role = user?.role;

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
            <ScrollTopButton />
          </MainLayout>
        }
      />

      {/* LOGIN ADMIN */}
      <Route path="/admin/login" element={<AuthLayout />} />

      {/* RUTAS ADMIN CON PROTECCIÓN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route
          path="settings"
          element={
            <PermissionGuard can={hasPermission(role, ["admin"])}>
              <SettingsPage />
            </PermissionGuard>
          }
        />

        <Route
          path="users"
          element={
            <PermissionGuard can={hasPermission(role, ["admin", "secretaria"])}>
              <UsersPanel />
            </PermissionGuard>
          }
        />

        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}
