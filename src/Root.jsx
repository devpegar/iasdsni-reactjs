import { useSiteConfig } from "./hooks/useSiteConfig.js";
import App from "./app/App.jsx";
import MaintenancePage from "./maintenance/MaintenancePage.jsx";

export default function Root() {
  const { loading, maintenance, launchDate } = useSiteConfig();
  console.log(maintenance);

  if (loading) return <div>Cargando...</div>;

  return maintenance ? <MaintenancePage launchDate={launchDate} /> : <App />;
}
