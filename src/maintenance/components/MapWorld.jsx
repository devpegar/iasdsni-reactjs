import "./MapWorld.scss";

export default function MapWorld() {
  return (
    <section className="mapworld">
      <div className="map-container">
        <iframe
          title="Ubicación Iglesia Adventista San Nicolás Centro"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53353.8135216955!2d-60.27671502107734!3d-33.302777127577954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b76789cdc4fd41%3A0x62183e69c44221af!2sIglesia%20Adventista%20del%20S%C3%A9ptimo%20D%C3%ADa%20-%20San%20Nicol%C3%A1s%20Centro!5e0!3m2!1ses-419!2sar!4v1762297926272!5m2!1ses-419!2sar"
          allowFullScreen="true"
          loading="lazy"
        ></iframe>
      </div>
      <div className="info">
        <h3>Horarios de reuniones</h3>
        <p>
          <strong>Sábado:</strong> 9:00 - 12:30
        </p>
        <p>
          <strong>Martes:</strong> 20:00 (por Zoom)
        </p>
        <h4>Contacto</h4>
        <p>
          <strong>Dirección:</strong> Rivadavia 161, San Nicolás de los Arroyos,
          Argentina
        </p>
        <p>
          <strong>Teléfono:</strong> +54 9 336 4683017
        </p>
        <p>
          <strong>Email:</strong> info@iasdsni.com.ar
        </p>
      </div>
    </section>
  );
}
