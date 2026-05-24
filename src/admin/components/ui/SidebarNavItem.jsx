import { NavLink } from "react-router-dom";

export default function SidebarNavItem({ item, collapsed }) {
  const Icon = item.icon;
  const title = item.disabled ? `${item.label} - próximamente` : item.label;

  if (item.disabled) {
    return (
      <span className="disabled sidebar-nav-item" title={title} aria-disabled="true">
        {Icon && <Icon className="sidebar-nav-item__icon" aria-hidden="true" />}
        <span className="sidebar-nav-item__label">{item.label}</span>
      </span>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className="sidebar-nav-item"
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
    >
      {Icon && <Icon className="sidebar-nav-item__icon" aria-hidden="true" />}
      <span className="sidebar-nav-item__label">{item.label}</span>
    </NavLink>
  );
}
