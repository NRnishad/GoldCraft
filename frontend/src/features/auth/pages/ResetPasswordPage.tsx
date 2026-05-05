import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { authApi } from "../api/authApi";

import "./LoginPage.css";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailFromUrl = useMemo(() => {
    return searchParams.get("email") || "";
  }, [searchParams]);

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    clearMessages();
  }

  function handleOtpChange(event: ChangeEvent<HTMLInputElement>) {
    const onlyNumbers = event.target.value.replace(/\D/g, "");

    if (onlyNumbers.length <= 6) {
      setOtp(onlyNumbers);
    }

    clearMessages();
  }

  function handleNewPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setNewPassword(event.target.value);
    clearMessages();
  }

  function handleConfirmPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value);
    clearMessages();
  }

  function clearMessages() {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage("OTP must be 6 digits.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      clearMessages();

      await authApi.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      setSuccessMessage("Password reset successfully. You can now sign in.");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section
        className="login-page__aside"
        aria-label="GoldCraft reset password"
      >
        <Link to="/login" className="login-brand" aria-label="GoldCraft home">
          <span className="login-brand__mark">G</span>

          <span className="login-brand__text">
            <strong>GoldCraft</strong>
            <small>AI gold poster studio</small>
          </span>
        </Link>

        <div className="login-page__aside-content">
          <p className="login-page__eyebrow">Reset with OTP</p>

          <h1>Create a new password using your email OTP.</h1>

          <p>
            Enter the OTP sent to your email and set a new password for your
            GoldCraft account.
          </p>
        </div>

        <div className="login-page__feature-list">
          <div className="login-page__feature-card">
            <span>01</span>
            <p>Request password reset OTP</p>
          </div>

          <div className="login-page__feature-card">
            <span>02</span>
            <p>Enter your email and 6-digit OTP</p>
          </div>

          <div className="login-page__feature-card">
            <span>03</span>
            <p>Set your new password and sign in again</p>
          </div>
        </div>
      </section>

      <section
        className="login-page__form-section"
        aria-label="Reset password form"
      >
        <div className="login-card">
          <div className="login-card__header">
            <Link to="/login" className="login-card__mobile-brand">
              <span className="login-brand__mark">G</span>
              <span>GoldCraft</span>
            </Link>

            <p className="login-card__eyebrow">Password reset</p>

            <h2>Set a new password</h2>

            <p>
              Enter the OTP from your email and choose a new password.
            </p>
          </div>

          {errorMessage && (
            <div className="login-card__error" role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="login-card__success" role="status">
              {successMessage}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-form__field" htmlFor="email">
              <span>Email address</span>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="login-form__field" htmlFor="otp">
              <span>Password reset OTP</span>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                autoComplete="one-time-code"
                required
              />
            </label>

            <label className="login-form__field" htmlFor="newPassword">
              <span>New password</span>

              <div className="login-form__password-input">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="login-form__password-toggle"
                  onClick={() => setShowNewPassword((value) => !value)}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            <label className="login-form__field" htmlFor="confirmPassword">
              <span>Confirm new password</span>

              <div className="login-form__password-input">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm new password"
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting password..." : "Reset password"}
            </button>
          </form>

          <p className="login-card__footer-text">
            Need a new OTP? <Link to="/forgot-password">Request again</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function EyeIcon() {
  return (
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
  );
}

function EyeOffIcon() {
  return (
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
  );
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string };

    if (data.message) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
}