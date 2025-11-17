import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HeroCarousel.scss";

import libroMisionero from "/assets/images/libro-la-clave-del-cambio.jpg";
import estudioBiblia from "/assets/images/estudios-biblicos.jpg";
import eventoIglesia from "/assets/images/expo-salud.jpg";

export default function HeroCarousel() {
  return (
    <section className="hero-carousel">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 7000 }}
        loop
        className="hero-swiper"
      >
        {/* Slide 1 - Libro misionero */}
        <SwiperSlide>
          <div className="slide-content">
            <div className="slide-text">
              <h2>Libro misionero del año</h2>
              <p>
                Descargá el libro misionero del año y compartí esperanza con
                quienes te rodean.
              </p>
              <a
                href="/assets/docs/libro-misionero-2025.pdf"
                className="btn-primary"
                download
              >
                Descargar PDF
              </a>
            </div>
            <div className="slide-image">
              <img
                src={libroMisionero}
                alt="Libro misionero del año"
                loading="lazy"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 - Estudio bíblico */}
        <SwiperSlide>
          <div className="slide-content">
            <div className="slide-text">
              <h2>Estudiá la Biblia con nosotros</h2>
              <p>
                Descubrí respuestas a tus preguntas a través de estudios
                bíblicos temáticos. ¡Pedí el tuyo!
              </p>
              <a
                href="https://wa.me/5493361234567?text=Hola!%20Quisiera%20recibir%20un%20estudio%20bíblico."
                className="btn-primary"
                target="_blank"
              >
                Solicitar estudio
              </a>
            </div>
            <div className="slide-image">
              <img src={estudioBiblia} alt="Estudio bíblico" loading="lazy" />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 - Eventos */}
        <SwiperSlide>
          <div className="slide-content">
            <div className="slide-text">
              <h2>Próximos eventos</h2>
              <p>
                Te invitamos a participar de las actividades y programas de la
                iglesia. ¡Estás invitado!
              </p>
              <a href="#eventos" className="btn-primary">
                Ver eventos
              </a>
            </div>
            <div className="slide-image">
              <img src={eventoIglesia} alt="Evento iglesia" loading="lazy" />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
