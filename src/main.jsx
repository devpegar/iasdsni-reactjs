import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import AuthProvider from "./context/AuthContext";
import { ToastProvider } from "./admin/hooks/ToastContext.jsx";

import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  </React.StrictMode>
);
