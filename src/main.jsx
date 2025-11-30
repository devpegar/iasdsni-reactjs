import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Root from "./Root";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import AdminLayout from "./admin/AdminLayout";
import SettingsPage from "./admin/SettingsPage";
import ProtectedRoute from "./admin/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* --- RUTA PÚBLICA PRINCIPAL (usa Root) --- */}
        <Route path="/" element={<Root />} />

        {/* --- LOGIN ADMIN --- */}
        <Route path="/admin/login" element={<Login />} />

        {/* --- PANEL ADMIN PROTEGIDO --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* <Route path="posts" element={<PostsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
