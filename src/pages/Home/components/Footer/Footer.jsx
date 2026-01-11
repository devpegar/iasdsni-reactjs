import { APP_VERSION } from "../../../../version";
import "./Footer.scss";
import logo from "/assets/logo-white.png";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Columna 1 - Logo + descripción */}
        <div className="footer__col">
          <img
            src={logo}
            alt="Logo IASD San Nicolás"
            className="footer__logo"
          />

          <div className="footer__desc">
            <p>Iglesia Adventista del Séptimo Día</p>
            <p>San Nicolás Centro</p>
            <p className="footer__frase">
              "Una comunidad que anuncia esperanza y se prepara para la segunda
              venida de Jesús."
            </p>
          </div>
        </div>

        {/* Columna 2 - Contacto + Redes */}
        <div className="footer__col">
          <h3>Contacto</h3>

          <p>
            <FaLocationDot /> Rivadavia 161, San Nicolás de los Arroyos
          </p>
          <p>
            <FaPhone /> 3364683017
          </p>
          <p>
            <FaEnvelope /> info@iasdsni.com.ar
          </p>

          <div className="footer__social">
            <a href="https://instagram.com/iasdsni" target="_blank">
              <FaInstagram />
            </a>
            <a href="https://facebook.com/iasdsni" target="_blank">
              <FaFacebookF />
            </a>
            <a href="https://x.com/iasdsni" target="_blank">
              <FaXTwitter />
            </a>
            <a
              href="https://www.whatsapp.com/channel/0029VabVP3G6BIEgIpDuz126"
              target="_blank"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        © {new Date().getFullYear()} IASD San Nicolás Centro – Diseñado por{" "}
        <a href="https://github.com/devpegar">DevpegAr</a>
        <p className="app-version">IASDSNI v{APP_VERSION}</p>
      </div>
    </footer>
  );
}
