import "./MaintenanceLayout.scss";
import logo from "/assets/logo-white.png";

export default function MaintenanceLayout({ children }) {
  return (
    <div className="layout-maintenance">
      <div className="content">{children}</div>
      <div className="sabbath-column">
        <img src={logo} alt="Logo Iglesia Adventista" className="logo" />
      </div>
    </div>
  );
}
