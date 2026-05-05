import { createBrowserRouter } from "react-router-dom";

import { App } from "./App";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { AdminLoginPage } from "../features/auth/pages/AdminLoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { VerifyEmailPage } from "../features/auth/pages/VerifyEmailPage";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/pages/ResetPasswordPage";
import { ChangePasswordPage } from "../features/auth/pages/ChangePasswordPage";
import { HomePage } from "../features/public/pages/HomePage";
import { PricingPage } from "../features/public/pages/PricingPage";
import { ShopOnboardingPage } from "../features/shop/pages/ShopOnboardingPage";
import { ShopProfilePage } from "../features/shop/pages/ShopProfilePage";
import { AdminUsersPage } from "../features/admin/pages/AdminUsersPage";
import { AdminUserDetailsPage } from "../features/admin/pages/AdminUserDetailsPage";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { RoleRoute } from "../shared/components/RoleRoute";
import { AppLayout } from "../shared/components/AppLayout";
import { UnauthorizedPage } from "../shared/pages/UnauthorizedPage";
import { NotFoundPage } from "../shared/pages/NotFoundPage";

function DashboardHomePage() {
  return (
    <div>
      <h1>GoldCraft Dashboard</h1>
      <p>Welcome to your GoldCraft workspace.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
  path: "/",
  element: <HomePage />,
},
{
  path: "/pricing",
  element: <PricingPage />,
},
{
  path: "/login",
  element: <LoginPage />,
},
{
  path: "/admin/login",
  element: <AdminLoginPage />,
},
{
  path: "/register",
  element: <RegisterPage />,
},
      {
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/dashboard",
                element: <DashboardHomePage />,
              },
              {
                path: "/change-password",
                element: <ChangePasswordPage />,
              },
            ],
          },
        ],
      },

      {
        element: <RoleRoute allowedRoles={["jeweller"]} />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/shop/onboarding",
                element: <ShopOnboardingPage />,
              },
              {
                path: "/shop/profile",
                element: <ShopProfilePage />,
              },
            ],
          },
        ],
      },

      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/admin/users",
                element: <AdminUsersPage />,
              },
              {
                path: "/admin/users/:userId",
                element: <AdminUserDetailsPage />,
              },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);