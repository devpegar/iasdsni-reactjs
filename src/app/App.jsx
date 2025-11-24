// src/app/App.jsx
import MainLayout from "../components/layout/MainLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import ScrollTopButton from "../components/ScrollToTop/ScrollTopButton.jsx";

export default function App() {
  return (
    <MainLayout>
      <Home />
      <ScrollTopButton />
    </MainLayout>
  );
}
