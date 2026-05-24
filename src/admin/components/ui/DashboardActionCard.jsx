import { Link } from "react-router-dom";
import clsx from "clsx";

export default function DashboardActionCard({
  to,
  icon: Icon,
  title,
  description,
  meta,
  badge,
  disabled = false,
}) {
  const content = (
    <>
      <div className="dashboard-action-card__icon">
        {Icon && <Icon aria-hidden="true" />}
      </div>
      <div className="dashboard-action-card__body">
        <div className="dashboard-action-card__topline">
          <h3>{title}</h3>
          {badge}
        </div>
        <p>{description}</p>
        {meta && <span className="dashboard-action-card__meta">{meta}</span>}
      </div>
    </>
  );

  if (disabled || !to) {
    return (
      <div className={clsx("dashboard-action-card", "is-disabled")}>
        {content}
      </div>
    );
  }

  return (
    <Link to={to} className="dashboard-action-card">
      {content}
    </Link>
  );
}
