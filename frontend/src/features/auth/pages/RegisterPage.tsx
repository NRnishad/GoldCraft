import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { clearAuthError, registerUser } from "../store/authSlice";
import type { RegisterInput } from "../types/authTypes";

import "./LoginPage.css";

interface RegisterFormState extends RegisterInput {
  confirmPassword: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();

    if (!cleanName) {
      setLocalError("Full name is required.");
      return;
    }

    if (!cleanEmail) {
      setLocalError("Email is required.");
      return;
    }

    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await dispatch(
        registerUser({
          name: cleanName,
          email: cleanEmail,
          password: formData.password,
        })
      ).unwrap();

      navigate(`/verify-email?email=${encodeURIComponent(cleanEmail)}`, {
        replace: true,
      });
    } catch {
      /**
       * Redux already stores backend error.
       */
    }
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
          <p className="login-page__eyebrow">Start your workspace</p>

          <h1>Create gold rate posters with less manual work.</h1>

          <p>
            Set up your jewellery shop workspace, create AI poster designs, and
            prepare daily gold rate updates for your customers.
          </p>
        </div>

        <div className="login-page__feature-list">
          <div className="login-page__feature-card">
            <span>01</span>
            <p>Create your GoldCraft account</p>
          </div>

          <div className="login-page__feature-card">
            <span>02</span>
            <p>Verify your email with OTP</p>
          </div>

          <div className="login-page__feature-card">
            <span>03</span>
            <p>Complete shop onboarding and start posting</p>
          </div>
        </div>
      </section>

      <section className="login-page__form-section" aria-label="Register form">
        <div className="login-card">
          <div className="login-card__header">
            <Link to="/login" className="login-card__mobile-brand">
              <span className="login-brand__mark">G</span>
              <span>GoldCraft</span>
            </Link>

            <p className="login-card__eyebrow">Create account</p>

            <h2>Start using GoldCraft</h2>

            <p>
              Create your account to manage your shop, generate posters, and
              share daily gold rate updates.
            </p>
          </div>

          {(error || localError) && (
            <div className="login-card__error" role="alert">
              {localError || error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-form__field" htmlFor="name">
              <span>Full name</span>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </label>

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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="login-form__password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            <label className="login-form__field" htmlFor="confirmPassword">
              <span>Confirm password</span>

              <div className="login-form__password-input">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="login-form__password-toggle"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              className="login-form__submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="login-card__footer-text">
            Already have an account? <Link to="/login">Sign in</Link>
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