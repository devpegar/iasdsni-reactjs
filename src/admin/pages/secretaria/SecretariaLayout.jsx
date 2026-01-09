// admin/secretaria/SecretariaLayout.jsx
import { Outlet } from "react-router-dom";
import "./styles/secretaria.scss";

export default function SecretariaLayout() {
  return (
    <div className="secretaria-layout">
      <div className="secretaria-section__header">
        <h1>Secretaría</h1>
      </div>
      <Outlet />
    </div>
  );
}
