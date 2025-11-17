import { useEffect, useRef, useState } from "react";
import "./ContactMap.scss";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { FaMailBulk } from "react-icons/fa";

export default function ContactMap() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

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
            src="https://www.google.com/maps?q=Rivadavia+161+San+Nicolás+de+los+Arroyos&output=embed"
            loading="lazy"
          ></iframe>
        </div>

        {/* 🔹 Información */}
        <div className="contact-map__info">
          <h2>Horarios de Culto</h2>

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

          <h3>Contacto</h3>

          <div className="contact-details">
            <p>
              <FaWhatsapp /> 3364683017
            </p>
            <p>
              <FaMailBulk /> info@iasdsni.com.ar
            </p>
          </div>

          <h3>Redes Sociales</h3>
          <div className="social-icons">
            <a
              href="https://instagram.com/iasdsni"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com/iasdsni"
              target="_blank"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a href="https://x.com/iasdsni" target="_blank" aria-label="X">
              <FaXTwitter />
            </a>
            <a
              href="https://www.whatsapp.com/channel/0029VabVP3G6BIEgIpDuz126"
              target="_blank"
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
