import clsx from "clsx";

export default function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}) {
  return (
    <header className={clsx("page-header", className)}>
      <div className="page-header__content">
        {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
