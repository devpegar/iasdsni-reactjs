import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import Loading from "../components/loading/Loading.jsx";

export default function ProtectedRoute({ children, roles = null }) {
  const { user, loading } = useAuth();

  // Aún cargando datos del backend
  if (loading) return <Loading />;

  // No autenticado
  if (!user) return <Navigate to="/admin/login" />;

  // Verificación de roles
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/admin/unauthorized" />;
  }

  return children;
}
