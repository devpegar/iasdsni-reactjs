import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { AuthContext } from "../admin/hooks/AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    apiGet("/auth/check.php")
      .then((res) => {
        setUser(res.authenticated ? res.user : null);
      })
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    try {
      await apiGet("/auth/logout.php");
    } catch (e) {
      console.error("Logout error", e);
    }

    // 💥 IMPORTANTE: limpiar el usuario inmediatamente
    setUser(null);

    // Y recargar estado desde backend en caso de dudas
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
