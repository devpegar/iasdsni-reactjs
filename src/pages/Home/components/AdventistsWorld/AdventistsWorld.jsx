import { useEffect, useState, useRef } from "react";
import useInViewAnimation from "../../../../hooks/useInViewAnimation";
import "./AdventistsWorld.scss";
import WorldMap from "/assets/images/map-world.png";

export default function AdventistsWorld() {
  const { ref, isVisible } = useInViewAnimation(0.3);
  const [members, setMembers] = useState(0);
  const mapRef = useRef(null);

  // Contador animado
  useEffect(() => {
    if (isVisible) {
      const total = 22476092;
      let start = 0;
      const duration = 2000;
      const increment = total / (duration / 16);

      const interval = setInterval(() => {
        start += increment;
        if (start >= total) {
          setMembers(total);
          clearInterval(interval);
        } else {
          setMembers(Math.floor(start));
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Efecto parallax solo en pantallas grandes
  useEffect(() => {
    if (window.innerWidth < 768) return; // 🔹 Desactiva en móviles

    const handleScroll = () => {
      const map = mapRef.current;
      if (!map) return;

      const rect = map.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollPercent =
          (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = scrollPercent * 30; // movimiento vertical
        const scale = 1.05 + scrollPercent * 0.05; // zoom leve

        map.style.transform = `translateY(${translateY}px) scale(${scale})`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="adventists-world" ref={ref}>
      <div className="adventists-container">
        {/* Columna izquierda - Imagen del mapa */}
        <div className={`world-map ${isVisible ? "visible" : ""}`}>
          <img
            src={WorldMap}
            alt="Mapa con presencia adventista"
            loading="lazy"
            ref={mapRef}
          />
        </div>

        {/* Columna derecha - Información */}
        <div className={`world-info ${isVisible ? "visible" : ""}`}>
          <h2>Adventistas en el mundo</h2>
          <p>
            La Iglesia Adventista del Séptimo Día está presente en más de 200
            países, compartiendo esperanza a través de la educación, la salud y
            el servicio.
          </p>

          <ul className="world-stats">
            <li>
              <strong>9,589</strong> escuelas y universidades
            </li>
            <li>
              <strong>229</strong> hospitales y clínicas
            </li>
            <li>
              <strong>64</strong> centros de medios y publicaciones
            </li>
            <li>
              <strong>18</strong> fábricas de alimentos saludables
            </li>
          </ul>

          <div className="world-members">
            <span className="count">{members.toLocaleString("es-AR")}</span>
            <span className="label">miembros en el mundo</span>
          </div>
        </div>
      </div>
    </section>
  );
}
