import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../api/authApi";

import "./LoginPage.css";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage("Email is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await authApi.forgotPassword({
        email: cleanEmail,
      });

      setSuccessMessage("Password reset OTP sent to your email.");

      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(cleanEmail)}`, {
          replace: true,
        });
      }, 900);
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
        aria-label="GoldCraft password recovery"
      >
        <Link to="/login" className="login-brand" aria-label="GoldCraft home">
          <span className="login-brand__mark">G</span>

          <span className="login-brand__text">
            <strong>GoldCraft</strong>
            <small>AI gold poster studio</small>
          </span>
        </Link>

        <div className="login-page__aside-content">
          <p className="login-page__eyebrow">Recover your account</p>

          <h1>Reset your GoldCraft password with email OTP.</h1>

          <p>
            Enter your registered email address. GoldCraft will send a password
            reset OTP that lets you create a new password securely.
          </p>
        </div>

        <div className="login-page__feature-list">
          <div className="login-page__feature-card">
            <span>01</span>
            <p>Enter your registered email address</p>
          </div>

          <div className="login-page__feature-card">
            <span>02</span>
            <p>Receive a password reset OTP</p>
          </div>

          <div className="login-page__feature-card">
            <span>03</span>
            <p>Use the OTP to create a new password</p>
          </div>
        </div>
      </section>

      <section
        className="login-page__form-section"
        aria-label="Forgot password form"
      >
        <div className="login-card">
          <div className="login-card__header">
            <Link to="/login" className="login-card__mobile-brand">
              <span className="login-brand__mark">G</span>
              <span>GoldCraft</span>
            </Link>

            <p className="login-card__eyebrow">Password reset</p>

            <h2>Forgot your password?</h2>

            <p>
              Enter your email address and we will send a password reset OTP to
              your inbox.
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

            <button
              type="submit"
              className="login-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending OTP..." : "Send reset OTP"}
            </button>
          </form>

          <p className="login-card__footer-text">
            Remember your password? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
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