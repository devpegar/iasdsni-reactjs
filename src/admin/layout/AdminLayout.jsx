import { useEffect, useMemo, useState } from "react";
import {
  FaBars,
  FaBookOpen,
  FaCog,
  FaColumns,
  FaFileAlt,
  FaGlobe,
  FaHome,
  FaImages,
  FaLayerGroup,
  FaNewspaper,
  FaPhotoVideo,
  FaSitemap,
  FaSlidersH,
  FaTools,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import SidebarNavItem from "../components/ui/SidebarNavItem";
import SidebarToggle from "../components/ui/SidebarToggle";
import formatUsername from "../utils/formatUsername";
import "../styles/admin.scss";

const SIDEBAR_COLLAPSED_KEY = "iasdsni-admin-sidebar-collapsed";

const navGroups = [
  {
    key: "system",
    label: "Sistema",
    icon: FaTools,
    paths: ["/admin", "/admin/settings", "/admin/users", "/admin/secretaria"],
    items: [
      { label: "Dashboard", to: "/admin", end: true, icon: FaColumns },
      { label: "Configuración", to: "/admin/settings", icon: FaCog },
      { label: "Usuarios", to: "/admin/users", icon: FaUsers },
      { label: "Secretaría", to: "/admin/secretaria", icon: FaUserFriends },
    ],
  },
  {
    key: "content",
    label: "Contenido",
    icon: FaLayerGroup,
    paths: [
      "/admin/web",
      "/admin/hero-slides",
      "/admin/daily-verses",
      "/admin/pages",
      "/admin/gallery",
      "/admin/posts",
    ],
    items: [
      { label: "Dashboard CMS", to: "/admin/web", icon: FaGlobe },
      { label: "Hero Slides", to: "/admin/hero-slides", icon: FaImages },
      { label: "Versículo Diario", to: "/admin/daily-verses", icon: FaBookOpen },
      { label: "Páginas", to: "/admin/pages", icon: FaFileAlt },
      { label: "Galería", to: "/admin/gallery", icon: FaPhotoVideo },
      { label: "Noticias", to: "/admin/posts", disabled: true, icon: FaNewspaper },
    ],
  },
  {
    key: "structure",
    label: "Estructura y medios",
    icon: FaSitemap,
    paths: [
      "/admin/navigation",
      "/admin/home-sections",
      "/admin/site-settings",
      "/admin/media",
    ],
    items: [
      { label: "Menú", to: "/admin/navigation", icon: FaBars },
      { label: "Home", to: "/admin/home-sections", icon: FaHome },
      { label: "Configuración del sitio", to: "/admin/site-settings", icon: FaSlidersH },
      { label: "Multimedia", to: "/admin/media", icon: FaPhotoVideo },
    ],
  },
];

function getStoredSidebarState() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getStoredSidebarState);

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

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  return (
    <div className={`admin-layout${sidebarCollapsed ? " is-sidebar-collapsed" : ""}`}>
      <aside className={`sidebar${sidebarCollapsed ? " is-collapsed" : ""}`}>
        <div>
          <div className="sidebar-brand">
            <div className="sidebar-brand__mark">IA</div>
            <div className="sidebar-brand__text">
              <span>Panel</span>
              <strong>Admin</strong>
            </div>
            <SidebarToggle collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          </div>

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
              const GroupIcon = group.icon;

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
                    title={sidebarCollapsed ? group.label : undefined}
                    aria-label={sidebarCollapsed ? group.label : undefined}
                  >
                    <GroupIcon className="menu-group__icon" aria-hidden="true" />
                    <span className="menu-group__label">{group.label}</span>
                    <span className="menu-group__chevron" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.to}>
                          <SidebarNavItem item={item} collapsed={sidebarCollapsed} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <button
          className="btn btn-primary sidebar-logout"
          title={sidebarCollapsed ? "Salir" : undefined}
          aria-label={sidebarCollapsed ? "Salir" : undefined}
          onClick={logout}
        >
          <FaUserFriends aria-hidden="true" />
          <span>Salir</span>
        </button>
      </aside>

      <main className="content">
        <Breadcrumbs items={breadcrumbs} />
        <Outlet />
      </main>
    </div>
  );
}
