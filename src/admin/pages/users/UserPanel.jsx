import { useState } from "react";
import UsersTab from "./tabs/UsersTab";
import RolesTab from "./tabs/RolesTab";
import DepartmentsTab from "./tabs/DepartmentsTab";
import { useAuth } from "../../hooks/AuthContext";
import PermissionGuard from "../../components/PermissionGuard";
import hasPermission from "../../helper/hasPermision";

export default function UsersPanel() {
  const [active, setActive] = useState("users");
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  const role = user?.role;

  return (
    <div className="users-panel">
      <h2>Gestión de Usuarios</h2>

      {/* TABS */}
      <div className="tabs">
        <button
          className={`tab-button ${active === "users" ? "is-active" : ""}`}
          onClick={() => setActive("users")}
        >
          Usuarios
        </button>

        <button
          className={`tab-button ${active === "roles" ? "is-active" : ""}`}
          onClick={() => setActive("roles")}
        >
          Roles
        </button>

        <button
          className={`tab-button ${
            active === "departments" ? "is-active" : ""
          }`}
          onClick={() => setActive("departments")}
        >
          Departamentos
        </button>
      </div>

      {/* CONTENT */}
      <div className="tab-content">
        {active === "users" && (
          <PermissionGuard can={hasPermission(role, ["admin"])}>
            <UsersTab />
          </PermissionGuard>
        )}
        {active === "roles" && (
          <PermissionGuard can={hasPermission(role, ["admin"])}>
            <RolesTab />
          </PermissionGuard>
        )}
        {active === "departments" && (
          <PermissionGuard can={hasPermission(role, ["admin", "secretaria"])}>
            <DepartmentsTab />
          </PermissionGuard>
        )}
      </div>
    </div>
  );
}
