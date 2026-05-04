import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { authApi } from "../api/authApi";
import { clearAuthError, loginUser } from "../store/authSlice";
import type { LoginInput } from "../types/authTypes";

import "./LoginPage.css";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

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
       * The error is already saved in Redux by authSlice.
       * So we do not need to set another local error here.
       */
    }
  }

  function handleGoogleLogin() {
    window.location.href = authApi.googleLoginUrl();
  }

  function togglePasswordVisibility() {
    setShowPassword((currentValue) => !currentValue);
  }

  return (
    <main className="login-page">
      <section className="login-page__aside" aria-label="GoldCraft overview">
        <Link to="/login" className="login-brand" aria-label="GoldCraft home">
          <span className="login-brand__mark">G</span>

          <span className="login-brand__text">
            <strong>GoldCraft</strong>
            <small>AI gold poster studio</small>
          </span>
        </Link>

        <div className="login-page__aside-content">
          <p className="login-page__eyebrow">Gold business workspace</p>

          <h1>Daily gold rate posters, generated faster.</h1>

          <p>
            Create jewellery shop posters, share daily gold rate updates
          </p>
        </div>

        <div className="login-page__feature-list">
          <div className="login-page__feature-card">
            <p>Daily gold rate update poster workflow</p>
            <p>,</p>
            <p>AI poster generation for jewellery businesses</p>
          </div>

          
        </div>
      </section>

      <section className="login-page__form-section" aria-label="Login form">
        <div className="login-card">
          <div className="login-card__header">
            <Link to="/login" className="login-card__mobile-brand">
              <span className="login-brand__mark">G</span>
              <span>GoldCraft</span>
            </Link>

            <p className="login-card__eyebrow">Welcome back</p>

            <h2>Sign in to your account</h2>

            <p>
              Access your shop dashboard, gold rate poster tools, and admin
              workspace.
            </p>
          </div>

          <button
            type="button"
            className="login-card__google-button"
            onClick={handleGoogleLogin}
          >
            <span className="login-card__google-icon" aria-hidden="true">
              G
            </span>
            Continue with Google
          </button>

          <div className="login-card__divider" aria-hidden="true">
            <span>or sign in with email</span>
          </div>

          {error && (
            <div className="login-card__error" role="alert">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-form__field" htmlFor="email">
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

            <label className="login-form__field" htmlFor="password">
              <span>Password</span>

              <div className="login-form__password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-form__password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.73 5.08C11.15 5.03 11.57 5 12 5C16.97 5 20.5 8.11 22 12C21.55 13.17 20.86 14.27 19.97 15.22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.53 17.53C16.02 18.47 14.16 19 12 19C7.03 19 3.5 15.89 2 12C2.69 10.21 3.83 8.62 5.32 7.42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.88 9.88C9.34 10.42 9 11.17 9 12C9 13.66 10.34 15 12 15C12.83 15 13.58 14.66 14.12 14.12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M2 12C3.5 8.11 7.03 5 12 5C16.97 5 20.5 8.11 22 12C20.5 15.89 16.97 19 12 19C7.03 19 3.5 15.89 2 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <div className="login-form__meta-row">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="login-form__submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login-card__footer-text">
            New to GoldCraft? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}