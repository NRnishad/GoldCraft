import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";

export function ProtectedRoute() {
  const location = useLocation();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}