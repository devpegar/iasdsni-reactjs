import { Link } from "react-router-dom";
import Badge from "../Badge/Badge.jsx";
import ContentCard from "../ContentCard/ContentCard.jsx";
import "./MediaCard.scss";

const MEDIA_ASPECT_RATIOS = ["square", "wide", "video", "portrait"];

export default function MediaCard({
  imageSrc,
  imageAlt = "",
  title,
  description,
  meta,
  badge,
  href,
  actionLabel = "Ver más",
  aspectRatio = "wide",
  className = "",
}) {
  const safeAspectRatio = MEDIA_ASPECT_RATIOS.includes(aspectRatio) ? aspectRatio : "wide";
  const isInteractive = Boolean(href);
  const cardClasses = [
    "ui-media-card",
    `ui-media-card--${safeAspectRatio}`,
    isInteractive ? "ui-media-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <div className="ui-media-card__media">
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} className="ui-media-card__image" loading="lazy" />
        ) : (
          <div className="ui-media-card__fallback" aria-hidden="true">
            <span>IASDSNI</span>
          </div>
        )}
        {badge && (
          <div className="ui-media-card__badge">
            {typeof badge === "string" ? <Badge variant="primary">{badge}</Badge> : badge}
          </div>
        )}
      </div>

      <div className="ui-media-card__body">
        {meta && <p className="ui-media-card__meta">{meta}</p>}
        {title && <h3 className="ui-media-card__title">{title}</h3>}
        {description && <p className="ui-media-card__description">{description}</p>}
        {isInteractive && <span className="ui-media-card__action">{actionLabel}</span>}
      </div>
    </>
  );

  if (isInteractive) {
    return (
      <ContentCard as={Link} to={href} interactive className={cardClasses}>
        {content}
      </ContentCard>
    );
  }

  return <ContentCard className={cardClasses}>{content}</ContentCard>;
}
