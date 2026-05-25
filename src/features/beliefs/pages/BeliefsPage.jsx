import { useEffect, useState } from "react";
import Seo from "../../seo/Seo";
import { EmptyState, PageHeader, SectionContainer, Skeleton } from "../../../components/ui";
import BeliefDoctrineCard from "../components/BeliefDoctrineCard";
import { listBeliefDoctrines } from "../services/beliefsService";
import "./BeliefsPages.scss";

export default function BeliefsPage() {
  const [state, setState] = useState({ loading: true, doctrines: [], error: null });

  useEffect(() => {
    let ignore = false;

    async function loadDoctrines() {
      try {
        const { response, data } = await listBeliefDoctrines();
        if (ignore) return;

        if (!response.ok || data.success === false) {
          setState({
            loading: false,
            doctrines: [],
            error: data.message || "No se pudieron cargar las creencias.",
          });
          return;
        }

        setState({ loading: false, doctrines: data.data ?? [], error: null });
      } catch {
        if (!ignore) {
          setState({ loading: false, doctrines: [], error: "No se pudieron cargar las creencias." });
        }
      }
    }

    loadDoctrines();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <SectionContainer as="section" size="xl" className="beliefs-page beliefs-page--index">
      <Seo
        title="Doctrinas"
        description="Doctrinas principales de la Iglesia Adventista del Séptimo Día."
        canonical="/creencias"
      />

      <PageHeader
        eyebrow="Doctrinas"
        title="Doctrinas"
        description="Seis grandes áreas doctrinales que reúnen las creencias bíblicas de la Iglesia Adventista."
        meta={
          !state.loading && !state.error && state.doctrines.length > 0
            ? `${state.doctrines.length} doctrinas principales`
            : null
        }
      />

      {state.loading && (
        <div className="beliefs-page__grid" aria-label="Cargando doctrinas">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="beliefs-page__skeleton" key={index}>
              <Skeleton variant="media" />
              <Skeleton variant="text" width="72%" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="44%" />
            </div>
          ))}
        </div>
      )}

      {state.error && <EmptyState title="No se pudieron cargar las creencias" description={state.error} />}

      {!state.loading && !state.error && state.doctrines.length === 0 && (
        <EmptyState
          title="No hay doctrinas publicadas"
          description="Cuando haya doctrinas activas, aparecerán en esta sección."
        />
      )}

      {!state.loading && !state.error && state.doctrines.length > 0 && (
        <div className="beliefs-page__grid">
          {state.doctrines.map((doctrine) => (
            <BeliefDoctrineCard doctrine={doctrine} key={doctrine.id} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
