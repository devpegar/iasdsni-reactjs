import { Link } from "react-router-dom";
import Badge from "../Badge/Badge.jsx";
import ContentCard from "../ContentCard/ContentCard.jsx";
import "./NewsCard.scss";

const NEWS_CARD_VARIANTS = ["default", "compact", "featured"];

export default function NewsCard({
  imageSrc,
  imageAlt = "",
  title,
  excerpt,
  date,
  category,
  href,
  featured = false,
  variant = "default",
  actionLabel = "Leer más",
  className = "",
}) {
  const isInteractive = Boolean(href);
  const safeVariant = featured ? "featured" : NEWS_CARD_VARIANTS.includes(variant) ? variant : "default";
  const cardClasses = [
    "ui-news-card",
    `ui-news-card--${safeVariant}`,
    isInteractive ? "ui-news-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {imageSrc && (
        <div className="ui-news-card__media">
          <img src={imageSrc} alt={imageAlt} className="ui-news-card__image" loading="lazy" />
        </div>
      )}

      <div className="ui-news-card__body">
        {(category || date) && (
          <div className="ui-news-card__meta">
            {category && <Badge variant="muted">{category}</Badge>}
            {date && <time>{date}</time>}
          </div>
        )}
        {title && <h3 className="ui-news-card__title">{title}</h3>}
        {excerpt && <p className="ui-news-card__excerpt">{excerpt}</p>}
        {isInteractive && <span className="ui-news-card__action">{actionLabel}</span>}
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
