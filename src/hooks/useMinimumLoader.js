// src/hooks/useMinimumLoader.js
import { useEffect, useState } from "react";

export default function useMinimumLoader(isLoading, minDelay = 800) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Si terminó la carga real, aplicamos el delay mínimo
      const timer = setTimeout(() => {
        setVisible(false);
      }, minDelay);

      return () => clearTimeout(timer);
    } else {
      // Cada vez que comienza una nueva carga, el loader vuelve a mostrarse
      setVisible(true);
    }
  }, [isLoading, minDelay]);

  return visible;
}
