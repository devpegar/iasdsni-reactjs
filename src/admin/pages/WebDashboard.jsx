import { FaImage, FaNewspaper } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function WebDashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard CMS</h2>
          <p>Gestion de contenido visible en el sitio publico.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link to="/admin/hero-slides" className="dashboard-card">
          <div className="dashboard-card__icon">
            <FaImage />
          </div>
          <div>
            <h3>Hero Slides</h3>
            <p>Administrar banners, llamados a la accion, imagenes y orden.</p>
            <span>Gestionar slides</span>
          </div>
        </Link>

        <div className="dashboard-card dashboard-card--disabled">
          <div className="dashboard-card__icon">
            <FaNewspaper />
          </div>
          <div>
            <h3>Noticias</h3>
            <p>Modulo editorial preparado para futuras publicaciones.</p>
            <span>Proximamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
