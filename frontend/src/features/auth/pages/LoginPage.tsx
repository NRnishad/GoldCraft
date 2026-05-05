import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AppButton } from "../../../shared/components/AppButton";
import { FormMessage } from "../../../shared/components/FormMessage";
import { PasswordInput } from "../../../shared/components/PasswordInput";
import { clearAuthError, loginUser } from "../store/authSlice";
import type { LoginInput } from "../types/authTypes";
import { AuthCardHeader, AuthLayout } from "../components/AuthLayout";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const verifiedMessage = useMemo(() => {
    const verified = searchParams.get("verified");
    const email = searchParams.get("email");

    if (verified === "true") {
      return email
        ? `Email verified successfully for ${email}. You can now sign in.`
        : "Email verified successfully. You can now sign in.";
    }

    return null;
  }, [searchParams]);

  const [formData, setFormData] = useState<LoginInput>({
    email: searchParams.get("email") || "",
    password: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role === "admin") {
      navigate("/admin/users", { replace: true });
      return;
    }

    navigate("/shop/onboarding", { replace: true });
  }, [isAuthenticated, user, navigate]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    dispatch(clearAuthError());

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const loggedInUser = await dispatch(loginUser(formData)).unwrap();

      if (loggedInUser.role === "admin") {
        navigate("/admin/users", { replace: true });
        return;
      }

      navigate("/shop/onboarding", { replace: true });
    } catch {
      /**
       * Redux already stores backend error.
       */
    }
  }

  return (
    <AuthLayout
      eyebrow="Gold business workspace"
      title="Daily gold rate posters, generated faster."
      description="Create jewellery shop posters, share daily gold rate updates, and manage your GoldCraft workspace from one secure dashboard."
      formLabel="Login form"
      features={[
        {
          number: "01",
          text: "AI poster generation for jewellery businesses",
        },
        {
          number: "02",
          text: "Daily gold rate update poster workflow",
        },
        {
          number: "03",
          text: "Shop profile and admin user management",
        },
      ]}
    >
      <AuthCardHeader
        eyebrow="Welcome back"
        title="Sign in to your account"
        description="Access your shop dashboard, gold rate poster tools, and admin workspace."
      />

      {verifiedMessage && (
        <FormMessage type="success" message={verifiedMessage} />
      )}

      {error && <FormMessage type="error" message={error} />}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="app-field" htmlFor="email">
          <span>Email address</span>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="auth-form__meta-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <AppButton type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </AppButton>
      </form>

      <p className="auth-card__footer-text">
        New to GoldCraft? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}