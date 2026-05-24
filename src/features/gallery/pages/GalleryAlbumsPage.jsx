import { useEffect, useState } from "react";
import Seo from "../../seo/Seo";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import {
  EmptyState,
  MediaCard,
  PageHeader,
  SectionContainer,
  Skeleton,
} from "../../../components/ui";
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

function formatImageCount(value) {
  const count = Number(value) || 0;
  return `${count} ${count === 1 ? "imagen" : "imágenes"}`;
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
          setState({
            loading: false,
            albums: [],
            error: data.message || "No se pudo cargar la galería.",
          });
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
    <SectionContainer as="section" size="xl" className="gallery-page gallery-page--albums">
      <Seo
        title="Galería"
        description="Álbumes de actividades y eventos de IASD San Nicolás Centro."
        canonical="/galeria"
      />

      <PageHeader
        eyebrow="Vida en comunidad"
        title="Galería"
        description="Momentos, actividades y encuentros de la Iglesia Adventista del Séptimo Día en San Nicolás Centro."
        meta={
          !state.loading && !state.error && state.albums.length > 0
            ? `${state.albums.length} ${state.albums.length === 1 ? "álbum publicado" : "álbumes publicados"}`
            : null
        }
      />

      {state.loading && (
        <div className="gallery-page__albums" aria-label="Cargando álbumes">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="gallery-page__album-skeleton" key={index}>
              <Skeleton variant="media" />
              <Skeleton variant="text" width="72%" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="44%" />
            </div>
          ))}
        </div>
      )}

      {state.error && (
        <EmptyState
          title="No se pudo cargar la galería"
          description={state.error}
        />
      )}

      {!state.loading && !state.error && state.albums.length === 0 && (
        <EmptyState
          title="No hay álbumes publicados"
          description="Cuando haya nuevas actividades disponibles, los álbumes aparecerán en esta sección."
        />
      )}

      {!state.loading && !state.error && state.albums.length > 0 && (
        <div className="gallery-page__albums">
          {state.albums.map((album) => {
            const formattedDate = formatDate(album.event_date);
            const metadata = [formattedDate, formatImageCount(album.total_items)]
              .filter(Boolean)
              .join(" · ");

            return (
              <MediaCard
                key={album.id}
                imageSrc={album.cover_image_url ? resolveMediaUrl(album.cover_image_url) : null}
                imageAlt={album.cover_alt_text || album.title}
                title={album.title}
                description={album.description}
                meta={metadata}
                badge="Galería"
                href={`/galeria/${album.slug}`}
                actionLabel="Ver álbum"
                aspectRatio="video"
              />
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
