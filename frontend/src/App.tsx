import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardPage } from "./features/auth/pages/DashboardPage";
import { ProtectedRoute } from "./shared/components/routes/ProtectedRoute";
import { PublicOnlyRoute } from "./shared/components/routes/PublicOnlyRoute";

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

