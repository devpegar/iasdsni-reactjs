import "./Header.scss";
// import logo from "/assets/logo.png";
import Logo from "../../../../components/logo/Logo";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaYoutube,
} from "react-icons/fa6";
import useSiteSettings from "../../../../features/site-settings/hooks/useSiteSettings";

function getWhatsappUrl(value, fallback) {
  if (!value) return fallback;
  if (value.startsWith("http")) return value;

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : fallback;
}

export default function Header() {
  const { settings } = useSiteSettings();
  const instagramUrl = settings.instagram_url || "https://instagram.com/iasdsni";
  const facebookUrl = settings.facebook_url || "https://facebook.com/iasdsni";
  const whatsappUrl = getWhatsappUrl(
    settings.whatsapp_number,
    "https://www.whatsapp.com/channel/0029VabVP3G6BIEgIpDuz126",
  );
  const emailUrl = settings.contact_email
    ? `mailto:${settings.contact_email}`
    : "mailto:info@iasdsni.com.ar";
  const logoUrl = settings.logo_header_url || settings.logo_url;

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div>
          <Logo
            logoUrl={logoUrl}
            siteName={settings.site_name}
            siteSubtitle={settings.site_subtitle}
          />
        </div>

        {/* Redes sociales */}
        <div className="header__social">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="instagram"
          >
            <FaInstagram />
            <span>Instagram</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="facebook"
          >
            <FaFacebookF />
            <span>Facebook</span>
          </a>

          <a href="https://x.com/iasdsni" target="_blank" rel="noreferrer" className="x">
            <FaXTwitter />
            <span>X</span>
          </a>

          {settings.youtube_url && (
            <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="youtube">
              <FaYoutube />
              <span>YouTube</span>
            </a>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="whatsapp"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>

          <a href={emailUrl} className="email">
            <FaEnvelope />
            <span>Email</span>
          </a>
        </div>
      </div>
    </header>
  );
}
