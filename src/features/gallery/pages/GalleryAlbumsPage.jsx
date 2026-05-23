import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../seo/Seo";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import { listGalleryAlbums } from "../services/galleryService";
import "./GalleryPages.scss";

function formatDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function GalleryAlbumsPage() {
  const [state, setState] = useState({ loading: true, albums: [], error: null });

  useEffect(() => {
    let ignore = false;

    async function loadAlbums() {
      try {
        const { response, data } = await listGalleryAlbums();
        if (ignore) return;

        if (!response.ok || data.success === false) {
          setState({ loading: false, albums: [], error: data.message || "No se pudo cargar la galería." });
          return;
        }

        setState({ loading: false, albums: data.data ?? [], error: null });
      } catch {
        if (!ignore) {
          setState({ loading: false, albums: [], error: "No se pudo cargar la galería." });
        }
      }
    }

    loadAlbums();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="gallery-page">
      <Seo title="Galería" description="Álbumes de actividades y eventos de IASD San Nicolás Centro." canonical="/galeria" />
      <h1>Galería</h1>

      {state.loading && <p>Cargando álbumes...</p>}
      {state.error && <p>{state.error}</p>}
      {!state.loading && !state.error && state.albums.length === 0 && <p>No hay álbumes publicados.</p>}

      <div className="gallery-page__albums">
        {state.albums.map((album) => (
          <Link className="gallery-album-card" to={`/galeria/${album.slug}`} key={album.id}>
            <div className="gallery-album-card__image">
              {album.cover_image_url ? (
                <img src={resolveMediaUrl(album.cover_image_url)} alt={album.cover_alt_text || album.title} />
              ) : (
                <span>Sin portada</span>
              )}
            </div>
            <div className="gallery-album-card__body">
              <h2>{album.title}</h2>
              {album.description && <p>{album.description}</p>}
              <div className="gallery-album-card__meta">
                {formatDate(album.event_date) && <span>{formatDate(album.event_date)}</span>}
                <span>{album.total_items} imágenes</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
