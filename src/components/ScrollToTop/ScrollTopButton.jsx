import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./ScrollTopButton.scss";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-top-btn ${visible ? "show" : ""}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
    >
      <FaArrowUp />
    </button>
  );
}
