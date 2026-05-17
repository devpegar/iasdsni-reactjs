import { useEffect, useState } from "react";
import { getJson } from "../services/httpClient";

export function useSiteConfig() {
  const [config, setConfig] = useState({
    loading: true,
    maintenance: false,
    launchDate: "2025-12-01T00:00:00",
  });

  useEffect(() => {
    getJson("/maintenance/get.php")
      .then(({ data }) => {
        setConfig({
          loading: false,
          maintenance: data.maintenance,
          launchDate: "2025-12-01T00:00:00",
        });
      })
      .catch(() => {
        setConfig((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  return config;
}
