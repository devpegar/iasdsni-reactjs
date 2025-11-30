import { useState } from "react";
import { apiPost } from "../services/api";
import { useNavigate } from "react-router-dom";

import "./styles/login.scss";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiPost("/auth/login.php", { username, password });

    if (!res.success) {
      setError(res.message);
      return;
    }

    localStorage.setItem("token", res.token);
    navigate("/admin");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="title">Iniciar Sesión</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Clave"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
