import { FaImage, FaNewspaper } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";

export default function WebDashboard() {
  return (
    <div className="dashboard">
      <PageHeader
        title="Dashboard CMS"
        description="Gestión de contenido visible en el sitio público."
      />

      <div className="dashboard-grid">
        <Link to="/admin/hero-slides" className="dashboard-card">
          <div className="dashboard-card__icon">
            <FaImage />
          </div>
          <div>
            <h3>Hero Slides</h3>
            <p>Administrar banners, llamados a la acción, imágenes y orden.</p>
            <span>Gestionar slides</span>
          </div>
        </Link>

        <div className="dashboard-card dashboard-card--disabled">
          <div className="dashboard-card__icon">
            <FaNewspaper />
          </div>
          <div>
            <h3>Noticias</h3>
            <p>Módulo editorial preparado para futuras publicaciones.</p>
            <span>Próximamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
