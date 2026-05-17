import { useEffect, useState } from "react";
import useInViewAnimation from "../../../../hooks/useInViewAnimation";
import { getJson } from "../../../../services/httpClient";
import "./VerseDaily.scss";

function normalizeVerse(data) {
  const verse = data?.verse || data?.daily_verse || data;
  const text = verse?.text ?? verse?.texto ?? "";
  const reference = verse?.reference ?? verse?.versiculo ?? "";
  const eop = verse?.eop ?? "";

  if (!text || !reference) return null;

  return { text, reference, eop };
}

export default function VerseDaily() {
  const [verse, setVerse] = useState(null);
  const { ref, isVisible } = useInViewAnimation(0.3);

  useEffect(() => {
    let ignore = false;

    const fetchVerse = async () => {
      try {
        const { response, data } = await getJson("/public/verses/random.php");

        if (!response.ok) return;
        const nextVerse = normalizeVerse(data);

        if (!ignore) {
          setVerse(nextVerse);
        }
      } catch {
        if (!ignore) {
          setVerse(null);
        }
      }
    };

    fetchVerse();

    return () => {
      ignore = true;
    };
  }, []);

  if (!verse) return null;

  return (
    // <section className={`verse-daily ${isVisible ? "visible" : ""}`} ref={ref}>
    <section
      className={`verse-daily ${isVisible || verse ? "visible" : ""}`}
      ref={ref}
    >
      <blockquote className="verse-daily__text">
        &ldquo;{verse.text}&rdquo;
        <footer className="verse-daily__ref">&mdash; {verse.reference}</footer>
        {verse.eop && <footer className="verse-daily__eop">{verse.eop}</footer>}
      </blockquote>
    </section>
  );
}
