import "./Home.scss";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="home">
      <Header />

      <section className="home__intro">
        <h1>Bienvenidos a la Iglesia Adventista de San Nicolás Centro</h1>
        <p>
          Estamos preparando un espacio para compartir esperanza, fe y servicio.
        </p>
      </section>
    </main>
  );
}
