import { useEffect, useState } from "react";
import versesData from "../../../../data/verses.json";
import useInViewAnimation from "../../../../hooks/useInViewAnimation";
import "./VerseDaily.scss";

export default function VerseDaily() {
  const [verse, setVerse] = useState(versesData[0]);
  const { ref, isVisible } = useInViewAnimation(0.3);

  // Elegir versículo aleatorio al cargar
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * versesData.length);
    setVerse(versesData[randomIndex]);
  }, []);

  return (
    <section className={`verse-daily ${isVisible ? "visible" : ""}`} ref={ref}>
      <blockquote className="verse-daily__text">
        “{verse.text}”
        <footer className="verse-daily__ref">— {verse.ref}</footer>
      </blockquote>
    </section>
  );
}
