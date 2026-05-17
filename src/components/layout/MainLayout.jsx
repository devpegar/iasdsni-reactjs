import { Outlet } from "react-router-dom";
import Header from "../../pages/Home/components/Header/Header";
import PublicNavbar from "../../pages/Home/components/PublicNavbar/PublicNavbar";
import Footer from "../../pages/Home/components/Footer/Footer";
import ScrollTopButton from "../ScrollToTop/ScrollTopButton";
import "./MainLayout.scss";
import logo from "/assets/logo-white.png";

export default function MainLayout() {
  return (
    <div className="layout">
      <div className="content">
        <Header />
        <PublicNavbar />
        <Outlet />
        <Footer />
        <ScrollTopButton />
      </div>

      <div className="sabbath-column">
        <img src={logo} alt="Logo Iglesia Adventista" className="logo" />
      </div>
    </div>
  );
}
