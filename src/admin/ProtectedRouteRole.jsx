import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { Navigate } from "react-router-dom";
import Loading from "../components/loading/Loading.jsx";

export default function ProtectedRouteRole({ children, role }) {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    apiGet("/auth/check.php").then((res) => {
      setAuthData(res);
    });
  }, []);

  if (authData === null) return <Loading />;

  // No logueado
  if (!authData.success) {
    return <Navigate to="/admin/login" />;
  }

  // Validación de rol
  const userRole = authData.user?.role;

  if (role && userRole !== role) {
    return <Navigate to="/admin/unauthorized" />;
  }

  return children;
}
