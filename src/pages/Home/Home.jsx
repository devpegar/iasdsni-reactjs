import "./Home.scss";
import Header from "./components/Header";
import HeroCarousel from "./components/HeroCarousel";
import VerseDaily from "./components/VerseDaily/VerseDaily";
import MissionVisionService from "./components/MissionVisionService";

export default function Home() {
  return (
    <main className="home">
      <Header />
      <HeroCarousel />
      <VerseDaily />
      <MissionVisionService />

      <section className="home__intro">
        <h1>Bienvenidos a la Iglesia Adventista de San Nicolás Centro</h1>
        <p>
          Estamos preparando un espacio para compartir esperanza, fe y servicio.
        </p>
      </section>
    </main>
  );
}
