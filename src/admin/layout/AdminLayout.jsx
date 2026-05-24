import { useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import formatUsername from "../utils/formatUsername";
import "../styles/admin.scss";

const navGroups = [
  {
    key: "system",
    label: "Sistema",
    paths: ["/admin", "/admin/settings", "/admin/users", "/admin/secretaria"],
    items: [
      { label: "Dashboard", to: "/admin", end: true },
      { label: "Configuración", to: "/admin/settings" },
      { label: "Usuarios", to: "/admin/users" },
      { label: "Secretaría", to: "/admin/secretaria" },
    ],
  },
  {
    key: "content",
    label: "Contenido",
    paths: [
      "/admin/web",
      "/admin/hero-slides",
      "/admin/daily-verses",
      "/admin/pages",
      "/admin/gallery",
      "/admin/posts",
    ],
    items: [
      { label: "Dashboard CMS", to: "/admin/web" },
      { label: "Hero Slides", to: "/admin/hero-slides" },
      { label: "Versículo Diario", to: "/admin/daily-verses" },
      { label: "Páginas", to: "/admin/pages" },
      { label: "Galería", to: "/admin/gallery" },
      { label: "Noticias", to: "/admin/posts", disabled: true },
    ],
  },
  {
    key: "structure",
    label: "Estructura y medios",
    paths: [
      "/admin/navigation",
      "/admin/home-sections",
      "/admin/site-settings",
      "/admin/media",
    ],
    items: [
      { label: "Menú", to: "/admin/navigation" },
      { label: "Home", to: "/admin/home-sections" },
      { label: "Configuración del sitio", to: "/admin/site-settings" },
      { label: "Multimedia", to: "/admin/media" },
    ],
  },
];

function getBreadcrumbs(pathname) {
  if (pathname === "/admin") {
    return [{ label: "Admin" }, { label: "Dashboard" }];
  }

  const group = navGroups.find((navGroup) => isGroupActive(pathname, navGroup));
  const item = group?.items.find((navItem) => {
    if (navItem.to === "/admin") return pathname === "/admin";
    return pathname === navItem.to || pathname.startsWith(`${navItem.to}/`);
  });

  const breadcrumbs = [{ label: "Admin", to: "/admin" }];

  if (group) {
    breadcrumbs.push({ label: group.label });
  }

  if (item) {
    breadcrumbs.push({ label: item.label });
  }

  if (pathname.includes("/secretaria/boards/new")) {
    breadcrumbs.push({ label: "Nueva junta" });
  } else if (pathname.includes("/secretaria/boards/") && pathname.endsWith("/edit")) {
    breadcrumbs.push({ label: "Editar junta" });
  } else if (pathname.includes("/secretaria/boards/")) {
    breadcrumbs.push({ label: "Detalle de junta" });
  }

  return breadcrumbs;
}

function isGroupActive(pathname, group) {
  return group.paths.some((path) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const breadcrumbs = useMemo(() => getBreadcrumbs(location.pathname), [location.pathname]);

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
                          {item.disabled ? (
                            <span className="disabled">{item.label}</span>
                          ) : (
                            <NavLink to={item.to} end={item.end}>
                              {item.label}
                            </NavLink>
                          )}
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
        <Breadcrumbs items={breadcrumbs} />
        <Outlet />
      </main>
    </div>
  );
}
