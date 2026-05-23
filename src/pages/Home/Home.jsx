import { useEffect, useState } from "react";
import "./Home.scss";
import HomeSectionRenderer from "./components/HomeSectionRenderer/HomeSectionRenderer";
import { listHomeSections } from "../../features/home/services/homeSectionsService";

const FALLBACK_SECTIONS = [
  { id: "fallback-hero", section_key: "hero_carousel", sort_order: 1 },
  { id: "fallback-verse", section_key: "verse_daily", sort_order: 2 },
  { id: "fallback-mission", section_key: "mission_vision_service", sort_order: 3 },
  { id: "fallback-world", section_key: "adventists_world", sort_order: 4 },
  { id: "fallback-gallery", section_key: "gallery", sort_order: 5 },
  { id: "fallback-contact", section_key: "contact_map", sort_order: 6 },
];

export default function Home() {
  const [sections, setSections] = useState(FALLBACK_SECTIONS);

  useEffect(() => {
    let ignore = false;

    async function loadSections() {
      try {
        const { response, data } = await listHomeSections();
        const nextSections = data.data ?? [];

        if (!ignore && response.ok && data.success !== false && nextSections.length) {
          setSections(nextSections);
        }
      } catch {
        if (!ignore) {
          setSections(FALLBACK_SECTIONS);
        }
      }
    }

    loadSections();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="home">
      {sections.map((section) => (
        <HomeSectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
