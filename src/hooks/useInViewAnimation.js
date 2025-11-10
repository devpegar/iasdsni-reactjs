import { useEffect, useRef, useState } from "react";

/**
 * Hook que detecta cuando un elemento entra en el viewport
 * y devuelve:
 * - ref: referencia para aplicar al elemento
 * - isVisible: boolean que indica si ya se mostró
 */
export default function useInViewAnimation(threshold = 0.3) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // solo se ejecuta una vez
        }
      },
      { threshold }
    );

    if (elementRef.current) observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref: elementRef, isVisible };
}
