import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import galleryData from "../../data/galleryData.json";
import "./Gallery.scss";

export default function Gallery() {
  const [index, setIndex] = useState(-1);

  return (
    <section className="gallery">
      <div className="gallery__container">
        <h2>Galería de imágenes</h2>
        <p>
          Una mirada a nuestras actividades, eventos y momentos de adoración que
          compartimos juntos como iglesia.
        </p>

        <div className="gallery__grid">
          {galleryData.map((img, i) => (
            <div
              key={img.id}
              className="gallery__item"
              onClick={() => setIndex(i)}
            >
              <img src={img.thumbnail} alt={img.description} loading="lazy" />
            </div>
          ))}
        </div>

        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          index={index}
          slides={galleryData.map((img) => ({
            src: img.src,
            description: img.description,
          }))}
        />
      </div>
    </section>
  );
}
