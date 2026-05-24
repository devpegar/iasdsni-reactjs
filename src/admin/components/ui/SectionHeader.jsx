import clsx from "clsx";

export default function SectionHeader({ title, description, actions, className }) {
  return (
    <div className={clsx("section-header", className)}>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>

      {actions && <div className="section-header__actions">{actions}</div>}
    </div>
  );
}
