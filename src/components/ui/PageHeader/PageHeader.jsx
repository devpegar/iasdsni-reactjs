import "./PageHeader.scss";

const HEADER_ALIGNMENTS = ["left", "center"];

export default function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  align = "left",
  className = "",
}) {
  const safeAlign = HEADER_ALIGNMENTS.includes(align) ? align : "left";
  const classes = ["ui-page-header", `ui-page-header--${safeAlign}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      {eyebrow && <p className="ui-page-header__eyebrow">{eyebrow}</p>}
      {title && <h1 className="ui-page-header__title">{title}</h1>}
      {description && <p className="ui-page-header__description">{description}</p>}
      {meta && <div className="ui-page-header__meta">{meta}</div>}
      {actions && <div className="ui-page-header__actions">{actions}</div>}
    </header>
  );
}
