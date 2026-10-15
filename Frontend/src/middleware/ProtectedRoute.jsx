import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router";

function ProtectedRoute({ children, admin = false }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = admin
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("token");

    setIsAuthenticated(Boolean(token));
    setLoading(false);
  }, [admin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#d90416] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={admin ? "/admin/login" : "/login"}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;