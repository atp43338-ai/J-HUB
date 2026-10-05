import { Navigate, useLocation } from "react-router";

function PublicRoute({ children, admin = false }) {
  const location = useLocation();

  // Check the correct token
  const token = admin
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");

  // If already logged in
  if (token) {
    return (
      <Navigate
        to={admin ? "/admin" : "/"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default PublicRoute;