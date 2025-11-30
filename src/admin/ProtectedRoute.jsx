import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { Navigate } from "react-router-dom";

import Loading from "../components/loading/Loading.jsx";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    apiGet("/auth/check.php").then((res) => {
      setAuth(res.success);
    });
  }, []);

  if (auth === null) return <Loading />;

  return auth ? children : <Navigate to="/admin/login" />;
}
