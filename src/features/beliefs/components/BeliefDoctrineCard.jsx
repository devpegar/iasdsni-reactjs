import { resolveMediaUrl } from "../../../utils/mediaUrl";
import { MediaCard } from "../../../components/ui";

export default function BeliefDoctrineCard({ doctrine }) {
  return (
    <MediaCard
      imageSrc={doctrine.image_url ? resolveMediaUrl(doctrine.image_url) : null}
      imageAlt={doctrine.title}
      title={doctrine.title}
      description={doctrine.summary}
      badge="Doctrina"
      href={`/creencias/${doctrine.slug}`}
      actionLabel="Entrar a la doctrina"
      aspectRatio="video"
      className="belief-doctrine-card"
    />
  );
}
