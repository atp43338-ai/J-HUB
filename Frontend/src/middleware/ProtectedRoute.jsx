import { Navigate } from "react-router";

function ProtectedRoute({ children, admin = false }) {
  const token = admin
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to={admin ? "/admin/login" : "/login"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;