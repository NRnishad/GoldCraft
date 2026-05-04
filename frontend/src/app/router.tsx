import { createBrowserRouter } from "react-router-dom";

import { App } from "./App";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { RoleRoute } from "../shared/components/RoleRoute";
import { AppLayout } from "../shared/components/AppLayout";

function HomePage() {
  return (
    <div>
      <h1>GoldCraft Frontend</h1>
      <p>Frontend foundation with Redux Toolkit is ready.</p>
    </div>
  );
}

function RegisterPagePlaceholder() {
  return (
    <div>
      <h1>Register Page</h1>
      <p>We will build this after login.</p>
    </div>
  );
}

function VerifyEmailPagePlaceholder() {
  return (
    <div>
      <h1>Verify Email Page</h1>
      <p>This will connect to Redis OTP email verification.</p>
    </div>
  );
}

function ForgotPasswordPagePlaceholder() {
  return (
    <div>
      <h1>Forgot Password Page</h1>
      <p>This will request a password reset email.</p>
    </div>
  );
}

function ResetPasswordPagePlaceholder() {
  return (
    <div>
      <h1>Reset Password Page</h1>
      <p>This will reset password using token.</p>
    </div>
  );
}

function ChangePasswordPagePlaceholder() {
  return (
    <div>
      <h1>Change Password Page</h1>
      <p>This is a protected auth page.</p>
    </div>
  );
}

function ShopOnboardingPagePlaceholder() {
  return (
    <div>
      <h1>Shop Onboarding Page</h1>
      <p>This will connect to /shop/onboarding.</p>
    </div>
  );
}

function ShopProfilePagePlaceholder() {
  return (
    <div>
      <h1>Shop Profile Page</h1>
      <p>This will connect to /shop/profile.</p>
    </div>
  );
}

function AdminUsersPagePlaceholder() {
  return (
    <div>
      <h1>Admin Users Page</h1>
      <p>Only admins can see this page.</p>
    </div>
  );
}

function AdminUserDetailsPagePlaceholder() {
  return (
    <div>
      <h1>Admin User Details Page</h1>
      <p>This will show one user by ID.</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPagePlaceholder />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmailPagePlaceholder />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPagePlaceholder />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPagePlaceholder />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/",
                element: <HomePage />,
              },
              {
                path: "/change-password",
                element: <ChangePasswordPagePlaceholder />,
              },
              {
                path: "/shop/onboarding",
                element: <ShopOnboardingPagePlaceholder />,
              },
              {
                path: "/shop/profile",
                element: <ShopProfilePagePlaceholder />,
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
                element: <AdminUsersPagePlaceholder />,
              },
              {
                path: "/admin/users/:userId",
                element: <AdminUserDetailsPagePlaceholder />,
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