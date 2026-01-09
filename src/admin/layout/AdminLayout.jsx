import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import formatUsername from "../utils/formatUsername";
import "../styles/admin.scss";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <h2 className="menu-title">Panel Admin</h2>

          {user && (
            <div className="user-info">
              <div className="name">{formatUsername(user.username)}</div>
              <div className="role">{user.role}</div>
            </div>
          )}

          <nav>
            <NavLink to="/admin" end>
              Dashboard
            </NavLink>

            <NavLink to="/admin/settings">Configuración</NavLink>

            <NavLink to="/admin/users">Usuarios</NavLink>

            <NavLink to="/admin/posts" className="nav-link disabled">
              Noticias
            </NavLink>

            <NavLink to="/admin/secretaria">Secretaría</NavLink>
          </nav>
        </div>

        <button className="btn btn-primary" onClick={logout}>
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
