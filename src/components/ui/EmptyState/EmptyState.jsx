import "./EmptyState.scss";

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}) {
  const classes = ["ui-empty-state", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {icon && <div className="ui-empty-state__icon">{icon}</div>}
      {title && <h2 className="ui-empty-state__title">{title}</h2>}
      {description && <p className="ui-empty-state__description">{description}</p>}
      {action && <div className="ui-empty-state__action">{action}</div>}
    </div>
  );
}
