import "./Logo.scss";
import logoSymbol from "/assets/logo-simple.png";

export default function Logo() {
  return (
    <div className="iasd-logo">
      <img
        src={logoSymbol}
        alt="Logo Iglesia Adventista"
        className="iasd-logo__symbol"
      />

      <div className="iasd-logo__text">
        <span className="iasd-logo__line iasd-logo__line--1">
          Iglesia Adventista
        </span>

        <span className="iasd-logo__line iasd-logo__line--2">
          del Séptimo Día
        </span>

        <span className="iasd-logo__subline">SAN NICOLÁS CENTRO</span>
      </div>
    </div>
  );
}
