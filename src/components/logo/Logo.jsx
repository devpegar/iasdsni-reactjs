import "./Logo.scss";
import logoSymbol from "/assets/logo-simple.png";

export default function Logo({ logoUrl = "", siteName = "", siteSubtitle = "" }) {
  const hasCustomText = Boolean(siteName || siteSubtitle);
  const symbolSrc = logoUrl || logoSymbol;

  return (
    <div className="iasd-logo">
      <img
        src={symbolSrc}
        alt={siteName || "Logo Iglesia Adventista"}
        className="iasd-logo__symbol"
      />

      <div className="iasd-logo__text">
        {hasCustomText ? (
          <>
            <span className="iasd-logo__line iasd-logo__line--1">
              {siteSubtitle || "Iglesia Adventista"}
            </span>

            <span className="iasd-logo__subline">
              {siteName || "SAN NICOLÁS CENTRO"}
            </span>
          </>
        ) : (
          <>
            <span className="iasd-logo__line iasd-logo__line--1">
              Iglesia Adventista
            </span>

            <span className="iasd-logo__line iasd-logo__line--2">
              del Séptimo Día
            </span>

            <span className="iasd-logo__subline">SAN NICOLÁS CENTRO</span>
          </>
        )}
      </div>
    </div>
  );
}
