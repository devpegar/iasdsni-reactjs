import { useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import formatUsername from "../utils/formatUsername";
import "../styles/admin.scss";

const navGroups = [
  {
    key: "system",
    label: "Sistema",
    paths: ["/admin", "/admin/settings", "/admin/users", "/admin/secretaria"],
    items: [
      { label: "Dashboard", to: "/admin", end: true },
      { label: "Configuracion", to: "/admin/settings" },
      { label: "Usuarios", to: "/admin/users" },
      { label: "Secretaria", to: "/admin/secretaria" },
    ],
  },
  {
    key: "website",
    label: "Sitio Web",
    paths: [
      "/admin/web",
      "/admin/hero-slides",
      "/admin/daily-verses",
      "/admin/pages",
      "/admin/navigation",
      "/admin/home-sections",
      "/admin/site-settings",
      "/admin/media",
      "/admin/gallery",
      "/admin/posts",
    ],
    items: [
      { label: "Dashboard CMS", to: "/admin/web" },
      { label: "Hero Slides", to: "/admin/hero-slides" },
      { label: "Versiculo Diario", to: "/admin/daily-verses" },
      { label: "Páginas", to: "/admin/pages" },
      { label: "Menú", to: "/admin/navigation" },
      { label: "Home", to: "/admin/home-sections" },
      { label: "Configuración del sitio", to: "/admin/site-settings" },
      { label: "Multimedia", to: "/admin/media" },
      { label: "Galería", to: "/admin/gallery" },
      { label: "Noticias", to: "/admin/posts", disabled: true },
    ],
  },
];

function isGroupActive(pathname, group) {
  return group.paths.some((path) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const defaultOpenGroups = useMemo(
    () =>
      navGroups.reduce((acc, group) => {
        acc[group.key] = isGroupActive(location.pathname, group);
        return acc;
      }, {}),
    [location.pathname],
  );

  const [openGroups, setOpenGroups] = useState(defaultOpenGroups);

  useEffect(() => {
    setOpenGroups((prev) => ({
      ...prev,
      ...defaultOpenGroups,
    }));
  }, [defaultOpenGroups]);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="admin-layout">
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
            {navGroups.map((group) => {
              const isOpen = openGroups[group.key];
              const active = isGroupActive(location.pathname, group);

              return (
                <div
                  key={group.key}
                  className={`menu-group${active ? " is-active" : ""}`}
                >
                  <button
                    type="button"
                    className="menu-group__toggle"
                    onClick={() => toggleGroup(group.key)}
                    aria-expanded={isOpen}
                  >
                    <span>{group.label}</span>
                    {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </button>

                  {isOpen && (
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            end={item.end}
                            className={item.disabled ? "disabled" : undefined}
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <button className="btn btn-primary" onClick={logout}>
          Salir
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
