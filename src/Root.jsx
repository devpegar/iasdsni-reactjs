import { useSiteConfig } from "./hooks/useSiteConfig.js";
import App from "./app/App.jsx";
import MaintenancePage from "./maintenance/MaintenancePage.jsx";
import Loading from "./components/loading/Loading.jsx";

export default function Root() {
  const { loading, maintenance, launchDate } = useSiteConfig();

  if (loading) return <Loading />;

  return maintenance ? <MaintenancePage launchDate={launchDate} /> : <App />;
}
