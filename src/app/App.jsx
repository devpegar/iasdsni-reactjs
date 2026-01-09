import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../admin/routes/ProtectedRoute";
import PermissionGuard from "../admin/components/PermissionGuard";
import hasPermission from "../admin/helper/hasPermision";
import { useAuth } from "../admin/hooks/AuthContext";

import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home/Home";
import ScrollTopButton from "../components/ScrollToTop/ScrollTopButton";

import AdminLayout from "../admin/layout/AdminLayout";
import AuthLayout from "../admin/auth/AuthLayout";
import Dashboard from "../admin/pages/Dashboard";
import UsersPanel from "../admin/pages/users/UserPanel";
import SettingsPage from "../admin/pages/SettingsPage";
import Unauthorized from "../admin/pages/Unauthorized";

import SecretariaLayout from "../admin/pages/secretaria/SecretariaLayout";
import BoardListPage from "../admin/pages/secretaria/pages/BoardListPage";
import BoardFormPage from "../admin/pages/secretaria/pages/BoardFormPage";
import BoardDetailPage from "../admin/pages/secretaria/pages/BoardDetailPage";

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
        <Route
          path="secretaria"
          element={
            <PermissionGuard can={hasPermission(role, ["admin", "secretaria"])}>
              <SecretariaLayout />
            </PermissionGuard>
          }
        >
          {/* LISTADO PRINCIPAL */}
          <Route index element={<BoardListPage />} />

          {/* JUNTAS */}
          <Route path="boards">
            <Route path="new" element={<BoardFormPage />} />
            <Route path=":id" element={<BoardDetailPage />} />
            <Route path=":id/edit" element={<BoardFormPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
