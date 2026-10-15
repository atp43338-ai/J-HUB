import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router";

import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import NotFound from "./pages/NotFound";

function AdminQueryRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const search = location.search.toLowerCase();
    if (
      search.includes("adminlogin") ||
      search.includes("admin-login") ||
      search.includes("admin_login")
    ) {
      navigate("/admin/login", { replace: true });
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <>
      <AdminQueryRedirect />
      <Routes>
        <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/adminlogin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/AdminLogin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;