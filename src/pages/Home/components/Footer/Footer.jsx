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
  FaYoutube,
} from "react-icons/fa6";
import useSiteSettings from "../../../../features/site-settings/hooks/useSiteSettings";

function getWhatsappUrl(value, fallback) {
  if (!value) return fallback;
  if (value.startsWith("http")) return value;

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : fallback;
}

export default function Footer() {
  const { settings } = useSiteSettings();
  const footerText =
    settings.footer_text ||
    "Una comunidad que anuncia esperanza y se prepara para la segunda venida de Jesús.";
  const address = settings.address || "Rivadavia 161, San Nicolás de los Arroyos";
  const phone = settings.whatsapp_number || "3364683017";
  const email = settings.contact_email || "info@iasdsni.com.ar";
  const instagramUrl = settings.instagram_url || "https://instagram.com/iasdsni";
  const facebookUrl = settings.facebook_url || "https://facebook.com/iasdsni";
  const whatsappUrl = getWhatsappUrl(
    settings.whatsapp_number,
    "https://www.whatsapp.com/channel/0029VabVP3G6BIEgIpDuz126",
  );

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Columna 1 - Logo + descripción */}
        <div className="footer__col">
          <img
            src={settings.logo_url || logo}
            alt="Logo IASD San Nicolás"
            className="footer__logo"
          />

          <div className="footer__desc">
            <p>{settings.site_subtitle || "Iglesia Adventista del Séptimo Día"}</p>
            <p>{settings.site_name || "San Nicolás Centro"}</p>
            <p className="footer__frase">
              "{footerText}"
            </p>
          </div>
        </div>

        {/* Columna 2 - Contacto + Redes */}
        <div className="footer__col">
          <h3>Contacto</h3>

          <p>
            <FaLocationDot /> {address}
          </p>
          <p>
            <FaPhone /> {phone}
          </p>
          <p>
            <FaEnvelope /> {email}
          </p>

          <div className="footer__social">
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href={facebookUrl} target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://x.com/iasdsni" target="_blank" rel="noreferrer">
              <FaXTwitter />
            </a>
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noreferrer">
                <FaYoutube />
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        © {new Date().getFullYear()} {settings.site_name || "IASD San Nicolás Centro"} – Diseñado por{" "}
        <a href="https://github.com/devpegar">DevpegAr</a>
        <p className="app-version">IASDSNI v{APP_VERSION}</p>
      </div>
    </footer>
  );
}
