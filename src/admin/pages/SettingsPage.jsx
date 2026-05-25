import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../services/api";
import { toastBus } from "../../services/toastBus";
import { confirmDestructive } from "../utils/confirmAction";

export default function SettingsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    apiGet("/maintenance/get.php")
      .then((res) => {
        setMaintenance(res.maintenance);
      })
      .catch(() => {});
  }, []);

  const updateMaintenance = async () => {
    await apiPost("/maintenance/update.php", { maintenance });
  };

  const resetSecretaria = async () => {
    const confirm = confirmDestructive({
      title: "Reiniciar datos de Secretaría",
      detail: "Esto eliminará todas las juntas, asistencias y votos de prueba.",
      action: "Reiniciar Secretaría",
      irreversible: true,
    });

    if (!confirm) return;

    try {
      setResetting(true);
      const res = await apiPost("/admin/reset/secretaria.php");
      toastBus.success(res.message || "Reset ejecutado");
    } finally {
      setResetting(false);
    }
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
        <p>
          El mantenimiento se sirve desde <strong>maintenance.html</strong> y no depende
          del bundle React. Esto permite mantener una pantalla estable durante deploys por FTP.
        </p>

        <div className="actions">
          <button className="btn btn-primary" onClick={updateMaintenance}>
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
            className="btn btn-danger"
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
