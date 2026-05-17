import "./Home.scss";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import VerseDaily from "./components/VerseDaily/VerseDaily";
import MissionVisionService from "./components/MissionVisionService/MissionVisionService";
import AdventistsWorld from "./components/AdventistsWorld/AdventistsWorld";
import Gallery from "./components/Gallery/Gallery";
import ContactMap from "./components/ContactMap/ContactMap";

export default function Home() {
  return (
    <main className="home">
      <HeroCarousel />
      <VerseDaily />
      <MissionVisionService />
      <AdventistsWorld />
      <Gallery />
      <ContactMap />
    </main>
  );
}
