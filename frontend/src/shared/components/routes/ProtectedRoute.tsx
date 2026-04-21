import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <div className="loading-state">Checking session...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
