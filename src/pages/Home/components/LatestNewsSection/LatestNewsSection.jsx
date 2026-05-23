import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listNews } from "../../../../features/news/services/newsService";
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

export default function LatestNewsSection({ section }) {
  const [state, setState] = useState({ loading: true, items: [] });

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

  if (state.loading || !state.items.length) return null;

  return (
    <section className="latest-news-section">
      <div className="latest-news-section__header">
        <h2>{section?.title || "Últimas noticias"}</h2>
        {section?.subtitle && <p>{section.subtitle}</p>}
      </div>

      <div className="latest-news-section__grid">
        {state.items.map((item) => {
          const date = formatDate(item.published_at || item.updated_at);

          return (
            <article key={item.id} className="latest-news-card">
              <h3>
                <Link to={`/pagina/${item.slug}`}>{item.title}</Link>
              </h3>
              {date && <p className="latest-news-card__date">{date}</p>}
              {item.excerpt && <p>{item.excerpt}</p>}
            </article>
          );
        })}
      </div>

      <Link className="latest-news-section__link" to="/noticias">
        Ver todas las noticias
      </Link>
    </section>
  );
}
