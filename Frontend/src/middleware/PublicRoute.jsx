import { Navigate, useLocation } from "react-router";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default PublicRoute;