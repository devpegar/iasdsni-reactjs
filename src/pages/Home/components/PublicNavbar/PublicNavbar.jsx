import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJson } from "../../../../services/httpClient";
import "./PublicNavbar.scss";

export default function PublicNavbar() {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const menuId = "public-navbar-menu";

  useEffect(() => {
    let ignore = false;

    async function loadNavigation() {
      try {
        const { response, data } = await getJson("/public/navigation/list.php");

        if (!ignore && response.ok && data.success !== false) {
          setItems(data.data ?? []);
        }
      } catch {
        if (!ignore) {
          setItems([]);
        }
      }
    }

    loadNavigation();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!items.length) return null;

  return (
    <nav className={`public-navbar ${isOpen ? "public-navbar--open" : ""}`} aria-label="Navegación principal">
      <div className="public-navbar__inner">
        <button
          type="button"
          className="public-navbar__toggle"
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <ul className="public-navbar__list" id={menuId}>
        {items.map((item) => {
          const isInternal = item.url.startsWith("/");
          const sharedProps = {
            target: item.target,
            rel: item.target === "_blank" ? "noreferrer" : undefined,
            onClick: () => setIsOpen(false),
          };

          return (
            <li key={item.id} className="public-navbar__item">
              {isInternal ? (
                <Link to={item.url} {...sharedProps}>
                  {item.label}
                </Link>
              ) : (
                <a href={item.url} {...sharedProps}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
