import {
  FaBars,
  FaFileAlt,
  FaHome,
  FaImage,
  FaImages,
  FaNewspaper,
  FaPhotoVideo,
  FaSitemap,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import DashboardActionCard from "../components/ui/DashboardActionCard";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import StatusBadge from "../components/ui/StatusBadge";

export default function WebDashboard() {
  return (
    <div className="dashboard">
      <PageHeader
        title="Dashboard CMS"
        description="Gestión de contenido visible en el sitio público."
        actions={
          <>
            <Link to="/admin/media" className="btn btn-secondary">
              Multimedia
            </Link>
            <Link to="/admin/pages" className="btn btn-secondary">
              Páginas
            </Link>
          </>
        }
      />

      <section className="dashboard-hero dashboard-hero--cms">
        <DashboardActionCard
          to="/admin/hero-slides"
          icon={FaImage}
          title="Hero principal"
          description="Banners, textos, llamados a la acción, imágenes y orden del carrusel."
          meta="Portada"
          badge={<StatusBadge variant="info">Prioritario</StatusBadge>}
        />
        <DashboardActionCard
          to="/admin/media"
          icon={FaPhotoVideo}
          title="Multimedia"
          description="Imágenes optimizadas, carpetas y URLs reutilizables en el sitio."
          meta="Biblioteca"
        />
      </section>

      <SectionHeader
        title="Operación de contenido"
        description="Accesos directos para mantener el sitio actualizado."
      />

      <div className="dashboard-action-grid dashboard-action-grid--cms">
        <DashboardActionCard
          to="/admin/pages"
          icon={FaFileAlt}
          title="Páginas"
          description="Páginas públicas, noticias, anuncios y eventos."
          meta="Contenido editorial"
        />
        <DashboardActionCard
          to="/admin/home-sections"
          icon={FaHome}
          title="Home"
          description="Orden y activación de bloques de la portada."
          meta="Estructura de portada"
        />
        <DashboardActionCard
          to="/admin/navigation"
          icon={FaBars}
          title="Menú"
          description="Enlaces visibles en la navegación pública."
          meta="Navegación"
        />
        <DashboardActionCard
          to="/admin/gallery"
          icon={FaImages}
          title="Galería"
          description="Álbumes, portadas e imágenes publicadas."
          meta="Contenido visual"
        />
        <DashboardActionCard
          to="/admin/site-settings"
          icon={FaSitemap}
          title="Datos del sitio"
          description="Identidad, contacto, redes y textos globales."
          meta="Configuración pública"
        />
        <DashboardActionCard
          icon={FaNewspaper}
          title="Noticias"
          description="Módulo editorial preparado para futuras publicaciones."
          meta="Próximamente"
          disabled
        />
      </div>
    </div>
  );
}
