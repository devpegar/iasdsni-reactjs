import Countdown from "react-countdown";
import "./Hero.scss";
import churchImage from "/assets/images/construction-church.png"; // coloca tu imagen aquí

export default function Hero({ launchDate }) {
  return (
    <section className="hero">
      <div className="hero-left">
        <img src={churchImage} alt="Iglesia en construcción" />
      </div>

      <div className="hero-right">
        <h1>Sitio web en construcción</h1>
        <p className="phrase">
          “Edificando juntos un espacio para compartir esperanza.”
        </p>
        <div className="countdown">
          <Countdown date={launchDate} />
        </div>
      </div>
    </section>
  );
}
