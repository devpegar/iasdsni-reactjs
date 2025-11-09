import { useEffect, useState, useRef } from "react";
import versesData from "../../../../data/verses.json";
import "./VerseDaily.scss";

export default function VerseDaily() {
  const [verse, setVerse] = useState(versesData[0]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Elegir versículo aleatorio al cargar
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * versesData.length);
    setVerse(versesData[randomIndex]);
  }, []);

  // Detectar visibilidad del componente
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // se ejecuta una sola vez
        }
      },
      { threshold: 0.3 } // visible al 30%
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`verse-daily ${isVisible ? "visible" : ""}`}
      ref={sectionRef}
    >
      <blockquote className="verse-daily__text">
        “{verse.text}”
        <footer className="verse-daily__ref">— {verse.ref}</footer>
      </blockquote>
    </section>
  );
}
