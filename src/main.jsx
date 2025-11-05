import React from "react";
import ReactDOM from "react-dom/client";
import { siteConfig } from "./config/siteConfig";
import App from "./app/App.jsx";
import MaintenancePage from "./maintenance/MaintenancePage.jsx";
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {siteConfig.maintenance ? (
      <MaintenancePage launchDate={siteConfig.launchDate} />
    ) : (
      <App />
    )}
  </React.StrictMode>
);
