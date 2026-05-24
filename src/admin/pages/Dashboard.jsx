import { useEffect, useState } from "react";
import { FaCog, FaGlobe, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiGet } from "../../services/api";

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
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Resumen general de administracion del sistema y sitio web.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link to="/admin/settings" className="dashboard-card">
          <div className="dashboard-card__icon">
            <FaCog />
          </div>
          <div>
            <h3>Sistema</h3>
            <p>
              Configuracion global, usuarios, permisos y gestion interna.
            </p>
            <span>
              Mantenimiento: {maintenance ? "ACTIVADO" : "DESACTIVADO"}
            </span>
          </div>
        </Link>

        <Link to="/admin/web" className="dashboard-card">
          <div className="dashboard-card__icon">
            <FaGlobe />
          </div>
          <div>
            <h3>Sitio Web</h3>
            <p>Contenido publico, hero principal y modulos editoriales.</p>
            <span>CMS del sitio</span>
          </div>
        </Link>
      </div>

      <div className="maintenance-card">
        <h3>Estado del sitio</h3>
        <p>
          <strong>Mantenimiento:</strong>{" "}
          {maintenance ? "ACTIVADO" : "DESACTIVADO"}
        </p>
        <Link to="/admin/users" className="dashboard-inline-link">
          <FaUsers />
          Administrar usuarios
        </Link>
      </div>
    </div>
  );
}
