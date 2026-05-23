import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listNews } from "../services/newsService";
import Seo from "../../seo/Seo";

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

  if (state.loading) {
    return (
      <section>
        <Seo
          title="Noticias"
          description="Noticias y novedades de IASD San Nicolás Centro."
          canonical="/noticias"
          type="website"
        />
        <p>Cargando noticias...</p>
      </section>
    );
  }

  if (state.error) {
    return (
      <section>
        <Seo
          title="Noticias"
          description="Noticias y novedades de IASD San Nicolás Centro."
          canonical="/noticias"
          type="website"
        />
        <p>{state.error}</p>
      </section>
    );
  }

  if (!state.items.length) {
    return (
      <section>
        <Seo
          title="Noticias"
          description="Noticias y novedades de IASD San Nicolás Centro."
          canonical="/noticias"
          type="website"
        />
        <p>No hay noticias publicadas.</p>
      </section>
    );
  }

  return (
    <section>
      <Seo
        title="Noticias"
        description="Noticias y novedades de IASD San Nicolás Centro."
        canonical="/noticias"
        type="website"
      />
      <h1>Noticias</h1>

      {state.items.map((item) => {
        const date = formatDate(item.published_at || item.updated_at);

        return (
          <article key={item.id}>
            <h2>
              <Link to={`/pagina/${item.slug}`}>{item.title}</Link>
            </h2>
            {date && <p>{date}</p>}
            {item.excerpt && <p>{item.excerpt}</p>}
          </article>
        );
      })}
    </section>
  );
}
