import "./Home.scss";
import Header from "./components/Header/Header";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import VerseDaily from "./components/VerseDaily/VerseDaily";
import MissionVisionService from "./components/MissionVisionService/MissionVisionService";
import AdventistsWorld from "./components/AdventistsWorld/AdventistsWorld";
import Gallery from "./components/Gallery/Gallery";
import ContactMap from "./components/ContactMap/ContactMap";

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

      <section className="home__intro">
        <h1>Bienvenidos a la Iglesia Adventista de San Nicolás Centro</h1>
        <p>
          Estamos preparando un espacio para compartir esperanza, fe y servicio.
        </p>
      </section>
    </main>
  );
}
