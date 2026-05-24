import { useEffect, useId, useRef, useState } from "react";
import { listNews } from "../../../../features/news/services/newsService";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";
import { LinkButton, NewsCard } from "../../../../components/ui";
import "./LatestNewsSection.scss";

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

export default function LatestNewsSection({ section }) {
  const [state, setState] = useState({ loading: true, items: [] });
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    let ignore = false;

    async function loadLatestNews() {
      try {
        const { response, data } = await listNews(3);

        if (!ignore && response.ok && data.success !== false) {
          setState({ loading: false, items: data.data ?? [] });
        }
      } catch {
        if (!ignore) {
          setState({ loading: false, items: [] });
        }
      }
    }

    loadLatestNews();

    return () => {
      ignore = true;
    };
  }, []);

  function scrollToIndex(index) {
    const carousel = carouselRef.current;
    const safeIndex = Math.min(Math.max(index, 0), state.items.length - 1);
    const item = carousel?.children[safeIndex];

    if (!carousel || !item) return;

    carousel.scrollTo({
      left: item.offsetLeft - carousel.offsetLeft,
      behavior: "smooth",
    });
    setActiveIndex(safeIndex);
  }

  function scrollByDirection(direction) {
    const nextIndex = Math.min(
      Math.max(activeIndex + direction, 0),
      state.items.length - 1,
    );
    scrollToIndex(nextIndex);
  }

  function handleCarouselScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const items = Array.from(carousel.children);
    const nextIndex = items.reduce((closestIndex, item, index) => {
      const closestItem = items[closestIndex];
      const currentDistance = Math.abs(
        item.offsetLeft - carousel.offsetLeft - carousel.scrollLeft,
      );
      const closestDistance = Math.abs(
        closestItem.offsetLeft - carousel.offsetLeft - carousel.scrollLeft,
      );

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    setActiveIndex(nextIndex);
  }

  function handleCarouselKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByDirection(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByDirection(-1);
    }
  }

  if (state.loading || !state.items.length) return null;

  return (
    <section className="latest-news-section" aria-labelledby={titleId}>
      <div className="latest-news-section__header">
        <div>
          <h2 id={titleId}>{section?.title || "Últimas noticias"}</h2>
          {section?.subtitle && <p>{section.subtitle}</p>}
        </div>

        <div className="latest-news-section__controls" aria-label="Controles del carrusel">
          <button
            type="button"
            aria-label="Noticia anterior"
            onClick={() => scrollByDirection(-1)}
            disabled={activeIndex === 0}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Noticia siguiente"
            onClick={() => scrollByDirection(1)}
            disabled={activeIndex >= state.items.length - 1}
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="latest-news-section__carousel"
        aria-label="Últimas noticias"
        onKeyDown={handleCarouselKeyDown}
        onScroll={handleCarouselScroll}
        ref={carouselRef}
        tabIndex={0}
      >
        {state.items.map((item, index) => {
          const date = formatDate(item.published_at || item.updated_at);
          const image = getNewsImage(item);

          return (
            <div className="latest-news-section__slide" key={item.id}>
              <NewsCard
                imageSrc={image ? resolveMediaUrl(image) : null}
                imageAlt={item.title}
                title={item.title}
                excerpt={item.excerpt || item.meta_description}
                date={date}
                category="Noticia"
                href={`/pagina/${item.slug}`}
                variant="compact"
                actionLabel="Leer más"
              />
              <span className="latest-news-section__position">
                {index + 1} de {state.items.length}
              </span>
            </div>
          );
        })}
      </div>

      <div className="latest-news-section__dots" aria-label="Indicadores del carrusel">
        {state.items.map((item, index) => (
          <button
            type="button"
            aria-label={`Ir a noticia ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
            key={item.id}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>

      <LinkButton className="latest-news-section__link" href="/noticias" variant="ghost">
        Ver todas las noticias
      </LinkButton>
    </section>
  );
}
