import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import GalleryItem from "./GalleryItem";
import galleryData from "../../data/galleryData.json";
import { listGalleryAlbums } from "../../../../features/gallery/services/galleryService";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";

import "./Gallery.scss";

export default function Gallery() {
  const [index, setIndex] = useState(-1);
  const [albums, setAlbums] = useState([]);
  const [loadedAlbums, setLoadedAlbums] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadFeaturedAlbums() {
      try {
        const { response, data } = await listGalleryAlbums({ featured: true, limit: 3 });
        if (!ignore && response.ok && data.success !== false) {
          setAlbums(data.data ?? []);
        }
      } catch {
        if (!ignore) {
          setAlbums([]);
        }
      } finally {
        if (!ignore) {
          setLoadedAlbums(true);
        }
      }
    }

    loadFeaturedAlbums();

    return () => {
      ignore = true;
    };
  }, []);

  const hasAlbums = loadedAlbums && albums.length > 0;

  return (
    <section className="gallery">
      <div className="gallery__container">
        <h2>Galería de imágenes</h2>
        <p>
          Una mirada a nuestras actividades, eventos y momentos de adoración que
          compartimos juntos como iglesia.
        </p>

        {hasAlbums ? (
          <>
            <div className="gallery__grid">
              {albums.map((album) => (
                <Link className="gallery__album" to={`/galeria/${album.slug}`} key={album.id}>
                  {album.cover_image_url ? (
                    <img
                      src={resolveMediaUrl(album.cover_image_url)}
                      alt={album.cover_alt_text || album.title}
                      loading="lazy"
                    />
                  ) : (
                    <span>Sin portada</span>
                  )}
                  <strong>{album.title}</strong>
                  <small>{album.total_items} imágenes</small>
                </Link>
              ))}
            </div>
            <Link className="gallery__link" to="/galeria">Ver galería</Link>
          </>
        ) : (
          <>
            <div className="gallery__grid">
              {galleryData.map((img, i) => (
                <GalleryItem
                  key={img.id}
                  img={img}
                  index={i}
                  onClick={() => setIndex(i)}
                />
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
          </>
        )}
      </div>
    </section>
  );
}
