import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Iglesia Adventista del Séptimo Día - San
        Nicolás Centro. Todos los derechos reservados.
      </p>
      <p>
        Diseñado por{" "}
        <a
          href="https://instagram.com/devpegar"
          target="_blank"
          rel="noreferrer"
        >
          DevpegAr
        </a>
      </p>
    </footer>
  );
}
