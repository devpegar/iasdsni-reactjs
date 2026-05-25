import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../../seo/Seo";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import { EmptyState, PageHeader, SectionContainer, Skeleton } from "../../../components/ui";
import BeliefAccordion from "../components/BeliefAccordion";
import { getBeliefDoctrine } from "../services/beliefsService";
import "./BeliefsPages.scss";

export default function DoctrineDetailPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, doctrine: null, items: [], error: null });

  useEffect(() => {
    let ignore = false;

    async function loadDoctrine() {
      try {
        setState((current) => ({ ...current, loading: true, error: null }));
        const { response, data } = await getBeliefDoctrine(slug);
        if (ignore) return;

        if (!response.ok || data.success === false) {
          setState({
            loading: false,
            doctrine: null,
            items: [],
            error: data.message || "No se pudo cargar la doctrina.",
          });
          return;
        }

        setState({
          loading: false,
          doctrine: data.data?.doctrine ?? null,
          items: data.data?.items ?? [],
          error: null,
        });
      } catch {
        if (!ignore) {
          setState({ loading: false, doctrine: null, items: [], error: "No se pudo cargar la doctrina." });
        }
      }
    }

    loadDoctrine();
    return () => {
      ignore = true;
    };
  }, [slug]);

  if (state.loading) {
    return (
      <SectionContainer as="section" size="xl" className="beliefs-page beliefs-page--detail">
        <div className="beliefs-detail__hero">
          <div>
            <Skeleton variant="text" width="32%" />
            <Skeleton variant="title" width="60%" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </div>
          <Skeleton variant="media" />
        </div>
      </SectionContainer>
    );
  }

  if (state.error || !state.doctrine) {
    return (
      <SectionContainer as="section" size="xl" className="beliefs-page beliefs-page--detail">
        <EmptyState
          title="Doctrina no encontrada"
          description={state.error || "La doctrina solicitada no está disponible."}
          action={<Link to="/creencias">Volver a creencias</Link>}
        />
      </SectionContainer>
    );
  }

  const imageUrl = state.doctrine.image_url ? resolveMediaUrl(state.doctrine.image_url) : null;

  return (
    <SectionContainer as="section" size="xl" className="beliefs-page beliefs-page--detail">
      <Seo
        title={`${state.doctrine.title} | Creencias`}
        description={state.doctrine.summary}
        canonical={`/creencias/${state.doctrine.slug}`}
        image={state.doctrine.image_url}
      />

      <div className="beliefs-detail__hero">
        <PageHeader
          eyebrow="Creencias"
          title={state.doctrine.title}
          description={state.doctrine.summary}
          meta={`${state.items.length} ${state.items.length === 1 ? "creencia" : "creencias"}`}
          actions={<Link to="/creencias">Volver a creencias</Link>}
        />

        {imageUrl && (
          <div className="beliefs-detail__image">
            <img src={imageUrl} alt={state.doctrine.title} loading="lazy" />
          </div>
        )}
      </div>

      {state.items.length > 0 ? (
        <BeliefAccordion items={state.items} />
      ) : (
        <EmptyState
          title="No hay creencias publicadas"
          description="Cuando se carguen creencias activas para esta doctrina, aparecerán en esta página."
        />
      )}
    </SectionContainer>
  );
}
