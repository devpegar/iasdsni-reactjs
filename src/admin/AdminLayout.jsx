import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { NavLink, useNavigate, Outlet } from "react-router-dom";

import "./styles/admin.scss";

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState({
    users: false,
    roles: false,
    departments: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    apiGet("/auth/check.php").then((res) => {
      if (res.success) setUser(res.user);
    });
  }, []);

  const toggleMenu = (key) => {
    setOpenMenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const logout = async () => {
    await apiGet("/auth/logout.php");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <h2 style={{ marginBottom: "20px" }}>Panel Admin</h2>

          {user && (
            <div className="user-info">
              <div className="name">{user.username}</div>
              <div className="role">{user.role}</div>
            </div>
          )}

          <nav>
            <NavLink to="/admin" end>
              Dashboard
            </NavLink>

            <NavLink to="/admin/settings">Configuración</NavLink>

            <NavLink to="/admin/posts">Noticias</NavLink>

            {/* ADMINISTRACIÓN */}
            <h4 className="menu-title">Administración</h4>

            {/* Usuarios */}
            <div className="menu-group">
              <span onClick={() => toggleMenu("users")}>Usuarios ▾</span>

              {openMenu.users && (
                <ul>
                  <li>
                    <NavLink to="/admin/users">Listar usuarios</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/users/create">Crear usuario</NavLink>
                  </li>
                </ul>
              )}
            </div>

            {/* Roles */}
            <div className="menu-group">
              <span onClick={() => toggleMenu("roles")}>Roles ▾</span>

              {openMenu.roles && (
                <ul>
                  <li>
                    <NavLink to="/admin/roles">Listar roles</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/roles/create">Crear rol</NavLink>
                  </li>
                </ul>
              )}
            </div>

            {/* Departamentos */}
            <div className="menu-group">
              <span onClick={() => toggleMenu("departments")}>
                Departamentos ▾
              </span>

              {openMenu.departments && (
                <ul>
                  <li>
                    <NavLink to="/admin/departments">
                      Listar departamentos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/departments/create">
                      Crear departamento
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        </div>

        <button className="logout-btn" onClick={logout}>
          Salir
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
