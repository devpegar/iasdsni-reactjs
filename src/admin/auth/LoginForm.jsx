import { useState } from "react";
import { apiPost } from "../../services/api";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/AuthContext";

import FormLayout from "../layout/FormLayout";
import Field from "../components/form/Field";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { refresh } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await apiPost("/auth/login.php", {
      username,
      password,
    });

    if (res.success) {
      await refresh(); // 💥 ACTUALIZA EL CONTEXTO INMEDIATAMENTE
      navigate("/admin");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <FormLayout columns="1" onSubmit={handleLogin} className="auth-form">
      {error && <p className="auth-error">{error}</p>}

      <Field
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nombre de Usuario"
        required
      />

      <Field
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />

      <button type="submit" className="btn btn-primary">
        Ingresar
      </button>
    </FormLayout>
  );
}
