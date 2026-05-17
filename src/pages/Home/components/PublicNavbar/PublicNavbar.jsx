import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJson } from "../../../../services/httpClient";
import "./PublicNavbar.scss";

export default function PublicNavbar() {
  const [items, setItems] = useState([]);

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

  if (!items.length) return null;

  return (
    <nav className="public-navbar" aria-label="Navegación principal">
      <ul className="public-navbar__list">
        {items.map((item) => {
          const isInternal = item.url.startsWith("/");
          const sharedProps = {
            target: item.target,
            rel: item.target === "_blank" ? "noreferrer" : undefined,
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
