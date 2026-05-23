import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "../../seo/Seo";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import { getGalleryAlbum } from "../services/galleryService";
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

export default function GalleryAlbumPage() {
  const { slug = "" } = useParams();
  const [state, setState] = useState({ loading: true, album: null, error: null });
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let ignore = false;

    async function loadAlbum() {
      try {
        setState({ loading: true, album: null, error: null });
        const { response, data } = await getGalleryAlbum(slug);
        if (ignore) return;

        if (!response.ok || data.success === false) {
          setState({ loading: false, album: null, error: data.message || "No se pudo cargar el álbum." });
          return;
        }

        setState({ loading: false, album: data.data ?? null, error: null });
      } catch {
        if (!ignore) {
          setState({ loading: false, album: null, error: "No se pudo cargar el álbum." });
        }
      }
    }

    loadAlbum();
    return () => {
      ignore = true;
    };
  }, [slug]);

  if (state.loading) return <section><p>Cargando álbum...</p></section>;
  if (state.error) return <section><p>{state.error}</p></section>;
  if (!state.album) return <section><p>Álbum no disponible.</p></section>;

  const activeItem = activeIndex >= 0 ? state.album.items[activeIndex] : null;

  return (
    <section className="gallery-page">
      <Seo
        title={state.album.title}
        description={state.album.description}
        image={state.album.items?.[0]?.public_url}
        canonical={`/galeria/${state.album.slug}`}
        type="article"
      />

      <h1>{state.album.title}</h1>
      {formatDate(state.album.event_date) && <p>{formatDate(state.album.event_date)}</p>}
      {state.album.description && <p>{state.album.description}</p>}

      {state.album.items.length === 0 ? (
        <p>No hay imágenes publicadas en este álbum.</p>
      ) : (
        <div className="gallery-page__images">
          {state.album.items.map((item, index) => (
            <button className="gallery-image-card" key={item.id} onClick={() => setActiveIndex(index)}>
              <img src={resolveMediaUrl(item.public_url)} alt={item.alt_text || item.caption || state.album.title} />
              {item.caption && <span>{item.caption}</span>}
            </button>
          ))}
        </div>
      )}

      {activeItem && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setActiveIndex(-1)}>
          <div className="gallery-lightbox__content" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setActiveIndex(-1)}>Cerrar</button>
            <img src={resolveMediaUrl(activeItem.public_url)} alt={activeItem.alt_text || activeItem.caption || state.album.title} />
            {activeItem.caption && <p>{activeItem.caption}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
