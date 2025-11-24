import "./Home.scss";
import Header from "./components/Header/Header";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import VerseDaily from "./components/VerseDaily/VerseDaily";
import MissionVisionService from "./components/MissionVisionService/MissionVisionService";
import AdventistsWorld from "./components/AdventistsWorld/AdventistsWorld";
import Gallery from "./components/Gallery/Gallery";
import ContactMap from "./components/ContactMap/ContactMap";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return (
    <main className="home">
      <Header />
      <HeroCarousel />
      <VerseDaily />
      <MissionVisionService />
      <AdventistsWorld />
      <Gallery />
      <ContactMap />
      <Footer />
    </main>
  );
}
