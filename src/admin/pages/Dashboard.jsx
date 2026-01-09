import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

import useMinimumLoader from "../hooks/useMinimumLoader";
import Loading from "../../components/loading/Loading";

export default function Dashboard() {
  const [maintenance, setMaintenance] = useState(null);
  const [fetching, setFetching] = useState(true);

  const loading = useMinimumLoader(fetching, 800);

  useEffect(() => {
    apiGet("/maintenance/get.php").then((res) => {
      if (res.success) setMaintenance(res.maintenance);
      setFetching(false);
    });
  }, []);

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
      </div>
    </div>
  );
}
