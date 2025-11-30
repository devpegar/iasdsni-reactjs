import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";

import useMinimumLoader from "../hooks/useMinimumLoader";
import Loading from "../components/loading/Loading";

import "./styles/admin.scss";

export default function Dashboard() {
  const [maintenance, setMaintenance] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  const loading = useMinimumLoader(fetching, 800);

  useEffect(() => {
    apiGet("/maintenance/get.php").then((res) => {
      if (res.success) setMaintenance(res.maintenance);
      setFetching(false);
    });
  }, []);

  const toggleMaintenance = async () => {
    setSaving(true);
    const res = await apiPost("/maintenance/update.php", {
      maintenance: !maintenance,
    });

    if (res.success) setMaintenance(res.maintenance);
    setSaving(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="maintenance-card">
        <h3>Estado del sitio:</h3>
        <p>
          <strong>Mantenimiento:</strong>{" "}
          {maintenance ? "ACTIVADO" : "DESACTIVADO"}
        </p>

        <button
          className="btn-toggle"
          onClick={toggleMaintenance}
          disabled={saving}
        >
          {saving
            ? "Guardando..."
            : maintenance
            ? "Desactivar mantenimiento"
            : "Activar mantenimiento"}
        </button>
      </div>
    </div>
  );
}
