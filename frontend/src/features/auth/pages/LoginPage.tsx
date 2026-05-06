import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { clearAuthError, forceLogout, loginUser } from "../store/authSlice";
import type { LoginInput } from "../types/authTypes";

import "./LoginPage.css";

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

  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (user.role === "jeweller") {
      navigate("/shop/onboarding", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    dispatch(clearAuthError());
    setLocalError(null);

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const loggedInUser = await dispatch(loginUser(formData)).unwrap();

      if (loggedInUser.role !== "jeweller") {
        dispatch(forceLogout());
        setLocalError("This login page is only for jeweller accounts. Please use admin login.");
        return;
      }

      navigate("/shop/onboarding", { replace: true });
    } catch {
      /**
       * Redux already stores backend error.
       */
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((currentValue) => !currentValue);
  }

  return (
    <main className="login-page">
      <section className="login-page__aside" aria-label="GoldCraft overview">
        <Link to="/" className="login-brand" aria-label="GoldCraft home">
          <span className="login-brand__mark">G</span>

          <span className="login-brand__text">
            <strong>GoldCraft</strong>
            <small>AI gold poster studio</small>
          </span>
        </Link>

        <div className="login-page__aside-content">
          <p className="login-page__eyebrow">Jeweller workspace</p>

          <h1>Sign in to create daily gold rate posters.</h1>

          <p>
            Access your jewellery shop dashboard, manage shop details, and
            prepare daily gold rate poster content from GoldCraft.
          </p>
        </div>

        <div className="login-page__feature-list">
          <div className="login-page__feature-card">
            <span>01</span>
            <p>Manage your jewellery shop profile</p>
          </div>

          <div className="login-page__feature-card">
            <span>02</span>
            <p>Prepare daily gold rate update content</p>
          </div>

          <div className="login-page__feature-card">
            <span>03</span>
            <p>Use GoldCraft poster generation tools</p>
          </div>
        </div>
      </section>

      <section className="login-page__form-section" aria-label="Jeweller login form">
        <div className="login-card">
          <div className="login-card__header">
            <Link to="/" className="login-card__mobile-brand">
              <span className="login-brand__mark">G</span>
              <span>GoldCraft</span>
            </Link>

            

            <h2>Sign in to your shop</h2>

           
          </div>

          {verifiedMessage && (
            <div className="login-card__success" role="status">
              {verifiedMessage}
            </div>
          )}

          {(error || localError) && (
            <div className="login-card__error" role="alert">
              {localError || error}
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
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
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

function EyeIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
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
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
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
  );
}