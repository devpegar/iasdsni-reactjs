import useInViewAnimation from "../../../hooks/useInViewAnimation";
import "./MissionVisionService.scss";

export default function MissionVisionService() {
  const mission = useInViewAnimation(0.2);
  const vision = useInViewAnimation(0.2);
  const service = useInViewAnimation(0.2);

  return (
    <section className="mvs-section">
      <div className="mvs-container">
        {/* Misión */}
        <div
          className={`mvs-box fade-in ${mission.isVisible ? "visible" : ""}`}
          ref={mission.ref}
        >
          <h3>Misión</h3>
          <p>
            Llevar el mensaje de esperanza y salvación al mundo, guiando a las
            personas a una relación más profunda con Cristo.
          </p>
          <a href="/mision" className="btn-outline">
            Más información
          </a>
        </div>

        {/* Visión */}
        <div
          className={`mvs-box fade-in ${vision.isVisible ? "visible" : ""}`}
          ref={vision.ref}
        >
          <h3>Visión</h3>
          <p>
            Ser una comunidad transformadora que refleja el carácter de Jesús y
            sirve con amor a la sociedad.
          </p>
          <a href="/vision" className="btn-outline">
            Más información
          </a>
        </div>

        {/* Servicio */}
        <div
          className={`mvs-box fade-in ${service.isVisible ? "visible" : ""}`}
          ref={service.ref}
        >
          <h3>Servicio</h3>
          <p>
            Comprometidos en ayudar a quienes lo necesitan a través de acciones
            solidarias y ministerios que promueven bienestar integral.
          </p>
          <a href="/servicio" className="btn-outline">
            Más información
          </a>
        </div>
      </div>
    </section>
  );
}
