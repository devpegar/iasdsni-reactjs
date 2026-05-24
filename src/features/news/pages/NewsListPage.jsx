import { useEffect, useState } from "react";
import { listNews } from "../services/newsService";
import Seo from "../../seo/Seo";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import {
  EmptyState,
  NewsCard,
  PageHeader,
  SectionContainer,
  Skeleton,
} from "../../../components/ui";
import "./NewsPages.scss";

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getNewsImage(item) {
  return item.featured_image || item.og_image || item.image_url || null;
}

export default function NewsListPage() {
  const [state, setState] = useState({ loading: true, items: [], error: null });

  useEffect(() => {
    let ignore = false;

    async function loadNews() {
      try {
        const { response, data } = await listNews();

        if (ignore) return;

        if (!response.ok || data.success === false) {
          setState({
            loading: false,
            items: [],
            error: data.message || "No se pudieron cargar las noticias.",
          });
          return;
        }

        setState({ loading: false, items: data.data ?? [], error: null });
      } catch {
        if (!ignore) {
          setState({
            loading: false,
            items: [],
            error: "No se pudieron cargar las noticias.",
          });
        }
      }
    }

    loadNews();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <SectionContainer as="section" size="lg" className="news-page news-page--list">
      <Seo
        title="Noticias"
        description="Noticias y novedades de IASD San Nicolás Centro."
        canonical="/noticias"
        type="website"
      />

      <PageHeader
        eyebrow="Actualidad"
        title="Noticias"
        description="Novedades, anuncios y relatos de la vida institucional de IASD San Nicolás Centro."
        meta={
          !state.loading && !state.error && state.items.length > 0
            ? `${state.items.length} ${state.items.length === 1 ? "publicación" : "publicaciones"}`
            : null
        }
      />

      {state.loading && (
        <div className="news-page__list" aria-label="Cargando noticias">
          <div className="news-page__skeleton news-page__skeleton--featured">
            <Skeleton variant="media" />
            <Skeleton variant="text" width="8rem" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="48%" />
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="news-page__skeleton" key={index}>
              <Skeleton variant="media" />
              <Skeleton variant="text" width="7rem" />
              <Skeleton variant="text" width="72%" />
              <Skeleton variant="text" />
            </div>
          ))}
        </div>
      )}

      {state.error && (
        <EmptyState
          title="No se pudieron cargar las noticias"
          description={state.error}
        />
      )}

      {!state.loading && !state.error && state.items.length === 0 && (
        <EmptyState
          title="No hay noticias publicadas"
          description="Las novedades institucionales aparecerán en esta sección cuando estén disponibles."
        />
      )}

      {!state.loading && !state.error && state.items.length > 0 && (
        <div className="news-page__list">
          {state.items.map((item, index) => {
            const date = formatDate(item.published_at || item.updated_at);
            const image = getNewsImage(item);

            return (
              <NewsCard
                key={item.id}
                imageSrc={image ? resolveMediaUrl(image) : null}
                imageAlt={item.title}
                title={item.title}
                excerpt={item.excerpt || item.meta_description}
                date={date}
                category={item.page_type === "news" ? "Noticia" : item.page_type}
                href={`/pagina/${item.slug}`}
                variant={index === 0 ? "featured" : "compact"}
              />
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
