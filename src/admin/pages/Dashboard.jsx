import { useEffect, useState } from "react";
import { FaCog, FaGlobe, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiGet } from "../../services/api";

import AdminCard from "../components/ui/AdminCard";
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

  return (
    <div className="dashboard">
      <PageHeader
        title="Dashboard"
        description="Resumen general de administración del sistema y sitio web."
      />

      <div className="dashboard-grid">
        <Link to="/admin/settings" className="dashboard-card">
          <div className="dashboard-card__icon">
            <FaCog />
          </div>
          <div>
            <h3>Sistema</h3>
            <p>
              Configuración global, usuarios, permisos y gestión interna.
            </p>
            <StatusBadge variant={maintenance ? "warning" : "success"}>
              Mantenimiento: {maintenance ? "activado" : "desactivado"}
            </StatusBadge>
          </div>
        </Link>

        <Link to="/admin/web" className="dashboard-card">
          <div className="dashboard-card__icon">
            <FaGlobe />
          </div>
          <div>
            <h3>Sitio Web</h3>
            <p>Contenido público, hero principal y módulos editoriales.</p>
            <span>CMS del sitio</span>
          </div>
        </Link>
      </div>

      <AdminCard className="maintenance-card">
        <SectionHeader title="Estado del sitio" />
        <p>
          <strong>Mantenimiento:</strong>{" "}
          <StatusBadge variant={maintenance ? "warning" : "success"}>
            {maintenance ? "Activado" : "Desactivado"}
          </StatusBadge>
        </p>
        <Link to="/admin/users" className="dashboard-inline-link">
          <FaUsers />
          Administrar usuarios
        </Link>
      </AdminCard>
    </div>
  );
}
