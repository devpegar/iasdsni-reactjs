import { Link } from "react-router-dom";
import "./NotFound.scss";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe o fue movida.</p>

        <Link to="/" className="not-found__btn">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
