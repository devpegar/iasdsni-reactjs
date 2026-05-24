import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaCog,
  FaGlobe,
  FaImages,
  FaPhotoVideo,
  FaSlidersH,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiGet } from "../../services/api";

import AdminCard from "../components/ui/AdminCard";
import DashboardActionCard from "../components/ui/DashboardActionCard";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import StatusBadge from "../components/ui/StatusBadge";
import useMinimumLoader from "../hooks/useMinimumLoader";
import Loading from "../../components/loading/Loading";

export default function Dashboard() {
  const [maintenance, setMaintenance] = useState(null);
  const [fetching, setFetching] = useState(true);

  const loading = useMinimumLoader(fetching, 800);

  useEffect(() => {
    apiGet("/maintenance/get.php")
      .then((res) => {
        setMaintenance(res.maintenance);
      })
      .catch(() => {
        setMaintenance(false);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  if (loading) return <Loading />;

  const maintenanceBadge = (
    <StatusBadge variant={maintenance ? "warning" : "success"}>
      {maintenance ? "Mantenimiento activo" : "Sitio activo"}
    </StatusBadge>
  );

  return (
    <div className="dashboard">
      <PageHeader
        title="Dashboard"
        description="Resumen general de administración del sistema y sitio web."
        actions={
          <>
            <Link to="/admin/web" className="btn btn-secondary">
              Ir al CMS
            </Link>
            <Link to="/admin/users" className="btn btn-secondary">
              Usuarios
            </Link>
          </>
        }
      />

      <section className="dashboard-hero">
        <AdminCard className="dashboard-status-card">
          <div className="dashboard-status-card__icon">
            <FaGlobe />
          </div>
          <div>
            <span className="dashboard-kicker">Estado general</span>
            <h2>{maintenance ? "Modo mantenimiento activado" : "Sitio público operativo"}</h2>
            <p>
              {maintenance
                ? "El sitio está protegido para visitantes mientras se realizan ajustes."
                : "El sitio está disponible para visitantes y el panel está listo para operar."}
            </p>
            <div className="dashboard-status-card__actions">
              {maintenanceBadge}
              <Link to="/admin/settings" className="btn btn-secondary">
                Revisar sistema
              </Link>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="dashboard-access-card">
          <SectionHeader
            title="Accesos rápidos"
            description="Tareas frecuentes del panel administrativo."
          />
          <div className="dashboard-quick-list">
            <Link to="/admin/web"><FaGlobe /> CMS del sitio</Link>
            <Link to="/admin/users"><FaUsers /> Usuarios</Link>
            <Link to="/admin/media"><FaPhotoVideo /> Multimedia</Link>
            <Link to="/admin/site-settings"><FaSlidersH /> Datos del sitio</Link>
          </div>
        </AdminCard>
      </section>

      <SectionHeader
        title="Áreas principales"
        description="Entradas directas a las zonas más usadas del panel."
      />

      <div className="dashboard-action-grid">
        <DashboardActionCard
          to="/admin/settings"
          icon={FaCog}
          title="Sistema"
          description="Configuración global, mantenimiento y herramientas internas."
          meta="Administración técnica"
          badge={maintenanceBadge}
        />
        <DashboardActionCard
          to="/admin/web"
          icon={FaGlobe}
          title="Sitio web"
          description="Contenido público, portada, páginas y módulos editoriales."
          meta="CMS operativo"
        />
        <DashboardActionCard
          to="/admin/users"
          icon={FaUserFriends}
          title="Usuarios"
          description="Roles, departamentos y accesos para el equipo administrativo."
          meta="Gestión interna"
        />
        <DashboardActionCard
          to="/admin/hero-slides"
          icon={FaImages}
          title="Portada"
          description="Slides principales y piezas visibles al entrar al sitio."
          meta="Contenido destacado"
        />
        <DashboardActionCard
          to="/admin/daily-verses"
          icon={FaBookOpen}
          title="Versículo diario"
          description="Textos, referencias y orden de publicación del módulo devocional."
          meta="Contenido recurrente"
        />
        <DashboardActionCard
          to="/admin/media"
          icon={FaPhotoVideo}
          title="Multimedia"
          description="Biblioteca de imágenes reutilizables para contenidos y configuración."
          meta="Assets del sitio"
        />
      </div>
    </div>
  );
}
