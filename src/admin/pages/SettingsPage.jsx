import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../services/api";

export default function SettingsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    apiGet("/maintenance/get.php").then((res) => {
      if (res?.success) setMaintenance(res.maintenance);
    });
  }, []);

  const updateMaintenance = async () => {
    await apiPost("/maintenance/update.php", { maintenance });
  };

  const resetSecretaria = async () => {
    const confirm = window.confirm(
      "⚠️ ATENCIÓN\n\nEsto eliminará TODAS las juntas, asistencias y votos.\nEsta acción NO se puede deshacer.\n\n¿Desea continuar?"
    );

    if (!confirm) return;

    setResetting(true);
    const res = await apiPost("/admin/reset/secretaria.php");
    alert(res.message || "Reset ejecutado");
    setResetting(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2>Configuración del sitio</h2>

        <label className="settings-switch">
          <input
            type="checkbox"
            checked={maintenance}
            onChange={(e) => setMaintenance(e.target.checked)}
          />
          <span className="switch-slider"></span>

          <span className="switch-label">Activar modo mantenimiento</span>
        </label>

        <div className="actions">
          <button className="btn-primary" onClick={updateMaintenance}>
            Guardar cambios
          </button>
        </div>
      </div>

      <div className="settings-card settings-card--danger">
        <h3>Zona peligrosa</h3>
        <p>
          Esta acción es solo para limpiar datos de prueba antes del uso real.
        </p>
        <div className="actions">
          <button
            className="btn-danger"
            onClick={resetSecretaria}
            disabled={resetting}
          >
            Reiniciar datos de Secretaría
          </button>
        </div>
      </div>
    </div>
  );
}
