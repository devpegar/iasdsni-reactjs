import { useState } from "react";
import { apiPost } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await apiPost("/auth/login.php", {
      username,
      password,
    });

    if (!response.success) {
      setError(response.message || "Credenciales incorrectas");
      return;
    }

    // guardar token y usuario
    localStorage.setItem("token", response.token);
    // localStorage.setItem("user", JSON.stringify(response.user));

    navigate("/admin");
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      {error && <p className="auth-error">{error}</p>}

      <div className="input-group">
        <label>Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="auth-btn">
        Ingresar
      </button>
    </form>
  );
}
