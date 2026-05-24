import {
  Badge,
  Button,
  ContentCard,
  EmptyState,
  LinkButton,
  MediaCard,
  NewsCard,
  PageHeader,
  SectionContainer,
  Skeleton,
} from "../../components/ui";
import "./UiPreviewPage.scss";

const mediaImage = "/assets/images/expo-salud.jpg";
const newsImage = "/assets/images/estudios-biblicos.jpg";

// Ruta temporal de desarrollo para revisar el sistema visual público.
export default function UiPreviewPage() {
  return (
    <main className="ui-preview">
      <SectionContainer size="lg">
        <PageHeader
          eyebrow="Design system"
          title="Preview UI IASDSNI"
          description="Vista temporal para validar componentes reutilizables antes de integrarlos en Galería y Noticias."
          meta="Acceso directo: /ui-preview"
          actions={
            <>
              <Button>Acción primaria</Button>
              <Button variant="outline">Acción secundaria</Button>
            </>
          }
        />

        <section className="ui-preview__section" aria-labelledby="preview-buttons">
          <h2 id="preview-buttons">Buttons</h2>
          <div className="ui-preview__row">
            <Button size="sm">Primary sm</Button>
            <Button>Primary md</Button>
            <Button size="lg">Primary lg</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
            <LinkButton href="/ui-preview" variant="outline">
              LinkButton
            </LinkButton>
          </div>
        </section>

        <section className="ui-preview__section" aria-labelledby="preview-badges">
          <h2 id="preview-badges">Badges</h2>
          <div className="ui-preview__row">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="muted">Muted</Badge>
          </div>
        </section>

        <section className="ui-preview__section" aria-labelledby="preview-cards">
          <h2 id="preview-cards">Cards</h2>
          <div className="ui-preview__grid">
            <ContentCard className="ui-preview__content-card">
              <Badge variant="primary">ContentCard</Badge>
              <h3>Panel informativo</h3>
              <p>
                Base visual reutilizable para contenidos, paneles y futuras cards editoriales.
              </p>
            </ContentCard>

            <MediaCard
              imageSrc={mediaImage}
              imageAlt="Actividad comunitaria"
              title="Álbum de actividades comunitarias"
              description="Colección multimedia preparada para validar imagen, metadatos, badge y llamada a la acción."
              meta="24 imágenes"
              badge="Galería"
              href="/ui-preview"
              aspectRatio="video"
            />

            <MediaCard
              title="Álbum sin imagen"
              description="Estado fallback para tarjetas multimedia cuando todavía no hay portada disponible."
              meta="8 imágenes"
              badge={<Badge variant="accent">Fallback</Badge>}
              aspectRatio="square"
            />
          </div>
        </section>

        <section className="ui-preview__section" aria-labelledby="preview-news">
          <h2 id="preview-news">NewsCard</h2>
          <div className="ui-preview__stack">
            <NewsCard
              imageSrc={newsImage}
              imageAlt="Estudios bíblicos"
              title="Nueva serie de estudios bíblicos para la comunidad"
              excerpt="Una propuesta editorial con jerarquía clara, metadata legible y una llamada a la acción preparada para los listados de noticias."
              date="24 mayo 2026"
              category="Noticias"
              href="/ui-preview"
              featured
            />

            <NewsCard
              title="Actualización institucional breve"
              excerpt="Variante sin imagen para comunicaciones simples, avisos y noticias relacionadas."
              date="18 mayo 2026"
              category="Comunidad"
              href="/ui-preview"
            />
          </div>
        </section>

        <section className="ui-preview__section" aria-labelledby="preview-states">
          <h2 id="preview-states">States</h2>
          <div className="ui-preview__grid">
            <EmptyState
              title="No hay contenido publicado"
              description="Este componente reemplazará mensajes sueltos en estados vacíos de Galería, Noticias y páginas futuras."
              action={<Button variant="outline">Volver</Button>}
            />

            <ContentCard className="ui-preview__skeleton-card">
              <Skeleton variant="media" />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="46%" />
              <Skeleton variant="circle" />
            </ContentCard>
          </div>
        </section>
      </SectionContainer>
    </main>
  );
}
