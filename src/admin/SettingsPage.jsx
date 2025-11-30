import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";

export default function SettingsPage() {
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    apiGet("/maintenance/get.php").then((res) => {
      if (res.success) setMaintenance(res.maintenance);
    });
  }, []);

  const updateMaintenance = () => {
    apiPost("/maintenance/update.php", { maintenance }).then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      <h2>Configuración del sitio</h2>

      <label>
        <input
          type="checkbox"
          checked={maintenance}
          onChange={(e) => setMaintenance(e.target.checked)}
        />
        Activar mantenimiento
      </label>

      <button onClick={updateMaintenance}>Guardar</button>
    </div>
  );
}
