import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "../../seo/Seo";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import {
  Badge,
  ContentCard,
  EmptyState,
  LinkButton,
  PageHeader,
  SectionContainer,
  Skeleton,
} from "../../../components/ui";
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

function formatImageCount(value) {
  const count = Number(value) || 0;
  return `${count} ${count === 1 ? "imagen" : "imágenes"}`;
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
          setState({
            loading: false,
            album: null,
            error: data.message || "No se pudo cargar el álbum.",
          });
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

  const albumItems = state.album?.items ?? [];
  const activeItem = activeIndex >= 0 ? albumItems[activeIndex] : null;

  useEffect(() => {
    if (!activeItem) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActiveIndex(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((currentIndex) => (currentIndex + 1) % albumItems.length);
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((currentIndex) => (
          currentIndex - 1 + albumItems.length
        ) % albumItems.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, albumItems.length]);

  function showPreviousImage() {
    setActiveIndex((currentIndex) => (
      currentIndex - 1 + albumItems.length
    ) % albumItems.length);
  }

  function showNextImage() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % albumItems.length);
  }

  if (state.loading) {
    return (
      <SectionContainer as="section" size="xl" className="gallery-page gallery-page--album">
        <Seo title="Cargando álbum" canonical={`/galeria/${slug}`} />
        <div className="gallery-page__header-skeleton">
          <Skeleton variant="text" width="8rem" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="82%" />
        </div>
        <div className="gallery-page__images" aria-label="Cargando imágenes">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton variant="media" className="gallery-page__image-skeleton" key={index} />
          ))}
        </div>
      </SectionContainer>
    );
  }

  if (state.error) {
    return (
      <SectionContainer as="section" size="lg" className="gallery-page gallery-page--album">
        <Seo title="Galería no disponible" canonical={`/galeria/${slug}`} />
        <EmptyState title="No se pudo cargar el álbum" description={state.error} />
      </SectionContainer>
    );
  }

  if (!state.album) {
    return (
      <SectionContainer as="section" size="lg" className="gallery-page gallery-page--album">
        <Seo title="Álbum no disponible" canonical={`/galeria/${slug}`} />
        <EmptyState
          title="Álbum no disponible"
          description="El álbum solicitado no existe o todavía no está publicado."
        />
      </SectionContainer>
    );
  }

  const formattedDate = formatDate(state.album.event_date);
  const metadata = [formatImageCount(albumItems.length), formattedDate].filter(Boolean).join(" · ");

  return (
    <SectionContainer as="section" size="xl" className="gallery-page gallery-page--album">
      <Seo
        title={state.album.title}
        description={state.album.description}
        image={albumItems[0]?.public_url}
        canonical={`/galeria/${state.album.slug}`}
        type="article"
      />

      <PageHeader
        eyebrow="Galería"
        title={state.album.title}
        description={state.album.description}
        meta={metadata}
        actions={
          <>
            <Badge variant="primary">Álbum</Badge>
            <LinkButton href="/galeria" variant="ghost" size="sm">
              Volver a galería
            </LinkButton>
          </>
        }
      />

      {albumItems.length === 0 ? (
        <EmptyState
          title="No hay imágenes publicadas"
          description="Este álbum todavía no tiene contenido multimedia disponible."
        />
      ) : (
        <div className="gallery-page__images">
          {albumItems.map((item, index) => (
            <ContentCard
              as="button"
              className="gallery-image-card"
              interactive
              key={item.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <img
                src={resolveMediaUrl(item.public_url)}
                alt={item.alt_text || item.caption || state.album.title}
                loading="lazy"
              />
              {item.caption && <span>{item.caption}</span>}
            </ContentCard>
          ))}
        </div>
      )}

      {activeItem && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-label={`Imagen ${activeIndex + 1} de ${albumItems.length}`}
          aria-modal="true"
          onClick={() => setActiveIndex(-1)}
        >
          <div className="gallery-lightbox__content" onClick={(event) => event.stopPropagation()}>
            <div className="gallery-lightbox__bar">
              <span>{activeIndex + 1} / {albumItems.length}</span>
              <button type="button" onClick={() => setActiveIndex(-1)}>Cerrar</button>
            </div>
            <div className="gallery-lightbox__stage">
              {albumItems.length > 1 && (
                <button
                  type="button"
                  className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                  onClick={showPreviousImage}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
              )}
              <img
                src={resolveMediaUrl(activeItem.public_url)}
                alt={activeItem.alt_text || activeItem.caption || state.album.title}
              />
              {albumItems.length > 1 && (
                <button
                  type="button"
                  className="gallery-lightbox__nav gallery-lightbox__nav--next"
                  onClick={showNextImage}
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>
              )}
            </div>
            {activeItem.caption && <p>{activeItem.caption}</p>}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
