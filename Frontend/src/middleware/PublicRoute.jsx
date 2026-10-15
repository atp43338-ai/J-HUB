import { Navigate, useLocation } from "react-router";

function PublicRoute({ children, admin = false }) {
  const location = useLocation();

  // Check the correct token
  const token = admin
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");

  // If already logged in
  if (token) {
    const fromPath =
      location.state?.from?.pathname ||
      location.state?.from ||
      (admin ? "/admin/dashboard" : "/");

    return (
      <Navigate
        to={fromPath}
        replace
      />
    );
  }

  return children;
}

export default PublicRoute;