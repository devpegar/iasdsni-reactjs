import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicPage } from "../services/publicPagesService";

export default function PublicPage() {
  const { slug = "" } = useParams();
  const [state, setState] = useState({
    loading: true,
    page: null,
    error: null,
  });

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      setState({ loading: true, page: null, error: null });

      try {
        const { response, data } = await getPublicPage(slug);

        if (ignore) return;

        if (!response.ok || data.success === false) {
          setState({
            loading: false,
            page: null,
            error: data.message || "No se pudo cargar la página.",
          });
          return;
        }

        setState({ loading: false, page: data.data ?? null, error: null });
      } catch {
        if (!ignore) {
          setState({
            loading: false,
            page: null,
            error: "No se pudo cargar la página.",
          });
        }
      }
    }

    loadPage();

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (state.loading) {
    return <section><p>Cargando página...</p></section>;
  }

  if (state.error) {
    return <section><p>{state.error}</p></section>;
  }

  if (!state.page) {
    return <section><p>No hay contenido disponible.</p></section>;
  }

  return (
    <article>
      <h1>{state.page.title}</h1>
      {state.page.meta_description && <p>{state.page.meta_description}</p>}
      {state.page.content ? (
        <div style={{ whiteSpace: "pre-wrap" }}>{state.page.content}</div>
      ) : (
        <p>No hay contenido disponible.</p>
      )}
    </article>
  );
}
