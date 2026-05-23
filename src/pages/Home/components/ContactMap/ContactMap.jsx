import { useEffect, useRef, useState } from "react";
import "./ContactMap.scss";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { FaMailBulk } from "react-icons/fa";
import useSiteSettings from "../../../../features/site-settings/hooks/useSiteSettings";

function getWhatsappUrl(value, fallback) {
  if (!value) return fallback;
  if (value.startsWith("http")) return value;

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : fallback;
}

function getServiceHourLines(value) {
  return value
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ContactMap() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { settings } = useSiteSettings();
  const serviceHourLines = getServiceHourLines(settings.service_hours || "");
  const mapUrl =
    settings.google_maps_url ||
    "https://www.google.com/maps?q=Rivadavia+161+San+Nicolás+de+los+Arroyos&output=embed";
  const whatsappUrl = getWhatsappUrl(
    settings.whatsapp_number,
    "https://www.whatsapp.com/channel/0029VabVP3G6BIEgIpDuz126",
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="contact-map" ref={ref}>
      <div className={`contact-map__container ${visible ? "visible" : ""}`}>
        {/* 🔹 Mapa */}
        <div className="contact-map__map">
          <iframe
            src={mapUrl}
            loading="lazy"
            title="Mapa de ubicación IASD San Nicolás"
          ></iframe>
        </div>

        {/* 🔹 Información */}
        <div className="contact-map__info">
          <h2>Horarios de Culto</h2>

          {serviceHourLines.length > 0 ? (
            <ul>
              {serviceHourLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <>
              <h3>Sábados</h3>
              <div className="sabbath-schedule">
                <ul className="sabbath-schedule__first">
                  <li>9:30 a 10:45 - Escuela Sabática</li>
                  <li>11:00 a 12:00 - Culto Sabático</li>
                  <li>18:00 a 19:00 - Ensayo del Coro</li>
                </ul>
                <ul className="sabbath-schedule__second">
                  <li>19:00 a 20:00 - Culto Joven</li>
                  <li>20:00 - Recreación (Voley, pingpong, buffet)</li>
                </ul>
              </div>

              <h3>Domingos</h3>
              <p>10:00 a 12:00 - Club de Conquistadores y Aventureros</p>

              <h3>Martes</h3>
              <p>20:00 - Culto de Oración (por Zoom)</p>
            </>
          )}

          <h3>Contacto</h3>

          <div className="contact-details">
            <p>
              <FaWhatsapp /> {settings.whatsapp_number || "3364683017"}
            </p>
            <p>
              <FaMailBulk /> {settings.contact_email || "info@iasdsni.com.ar"}
            </p>
          </div>

          <h3>Redes Sociales</h3>
          <div className="social-icons">
            <a
              href={settings.instagram_url || "https://instagram.com/iasdsni"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href={settings.facebook_url || "https://facebook.com/iasdsni"}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a href="https://x.com/iasdsni" target="_blank" rel="noreferrer" aria-label="X">
              <FaXTwitter />
            </a>
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Whatsapp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
