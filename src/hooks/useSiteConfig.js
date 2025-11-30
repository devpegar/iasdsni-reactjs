import { useEffect, useState } from "react";

export function useSiteConfig() {
  const [config, setConfig] = useState({
    loading: true,
    maintenance: false,
    launchDate: "2025-12-01T00:00:00",
  });

  useEffect(() => {
    fetch("http://localhost/iasdsni-api/maintenance/get.php")
      .then((res) => res.json())
      .then((data) => {
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
