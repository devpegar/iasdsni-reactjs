import "./MainLayout.scss";
import logo from "/assets/logo-white.png";

export default function MaintenanceLayout({ children }) {
  return (
    <div className="layout">
      <div className="content">{children}</div>
      <div className="sabbath-column">
        <img src={logo} alt="Logo Iglesia Adventista" className="logo" />
      </div>
    </div>
  );
}
