import MaintenanceLayout from "./layout/MaintenanceLayout";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MapWorld from "./components/MapWorld";
import Footer from "./components/Footer";
import "./maintenance.scss";

export default function MaintenancePage({ launchDate }) {
  return (
    <MaintenanceLayout>
      <Header />
      <Hero launchDate={launchDate} />
      <MapWorld />
      <Footer />
    </MaintenanceLayout>
  );
}
