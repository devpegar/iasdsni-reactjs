import { Link } from "react-router-dom";
// import "./styles/unauthorized.scss";

export default function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <h1>Acceso denegado</h1>
        <p>No tienes permisos para acceder a esta sección.</p>

        <Link to="/admin" className="back-btn">
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
