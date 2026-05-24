import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { getJson } from "../../../../services/httpClient";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HeroCarousel.scss";

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await getJson("/public/hero/slides.php");
        setSlides(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading || !slides.length) return null;

  return (
    <section className="hero-carousel">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 7000 }}
        loop={slides.length > 1}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content">
              <div className="slide-text">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>

                {slide.button_text && slide.button_url && (
                  <a
                    href={slide.button_url}
                    className="btn-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {slide.button_text}
                  </a>
                )}
              </div>

              <div className="slide-image">
                <img
                  src={resolveMediaUrl(slide.image_url || slide.image_path)}
                  alt={slide.title}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
