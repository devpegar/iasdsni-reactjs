import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";

import "./styles/admin.scss";

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiGet("/auth/check.php").then((res) => {
      if (res.success) setUser(res.user);
    });
  }, []);

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
