import HeroCarousel from "../HeroCarousel/HeroCarousel";
import VerseDaily from "../VerseDaily/VerseDaily";
import MissionVisionService from "../MissionVisionService/MissionVisionService";
import AdventistsWorld from "../AdventistsWorld/AdventistsWorld";
import Gallery from "../Gallery/Gallery";
import ContactMap from "../ContactMap/ContactMap";
import LatestNewsSection from "../LatestNewsSection/LatestNewsSection";

export const SECTION_COMPONENTS = {
  hero_carousel: HeroCarousel,
  verse_daily: VerseDaily,
  mission_vision_service: MissionVisionService,
  adventists_world: AdventistsWorld,
  gallery: Gallery,
  contact_map: ContactMap,
  latest_news: LatestNewsSection,
};

export default function HomeSectionRenderer({ section }) {
  const Component = SECTION_COMPONENTS[section.section_key];

  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`Sección de home no soportada: ${section.section_key}`);
    }

    return null;
  }

  return <Component section={section} />;
}
