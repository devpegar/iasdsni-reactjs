import "./Header.scss";
import logo from "/assets/logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa6";

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo">
          <img src={logo} alt="Logo Iglesia Adventista San Nicolás Centro" />
        </div>

        {/* Redes sociales */}
        <div className="header__social">
          <a
            href="https://instagram.com/iasdsni"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://facebook.com/iasdsni"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://x.com/iasdsni"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.whatsapp.com/channel/0029VabVP3G6BIEgIpDuz126"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a href="mailto:info@iasdsni.com.ar" aria-label="Email">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </header>
  );
}
