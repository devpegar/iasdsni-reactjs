import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

export default function SidebarToggle({ collapsed, onToggle }) {
  return (
    <button
      type="button"
      className="sidebar-toggle"
      aria-label={collapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
      aria-pressed={collapsed}
      title={collapsed ? "Expandir menú" : "Colapsar menú"}
      onClick={onToggle}
    >
      {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
    </button>
  );
}
