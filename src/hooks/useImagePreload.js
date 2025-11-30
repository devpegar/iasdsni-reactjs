// src/hooks/useImagePreload.js
import { useEffect, useState } from "react";

export default function useImagePreload(src) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return loaded;
}
