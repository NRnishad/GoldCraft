import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { authApi } from "../api/authApi";

import "./LoginPage.css";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailFromUrl = useMemo(() => {
    return searchParams.get("email") || "";
  }, [searchParams]);

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

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

  function clearMessages() {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleVerifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage("Email is required.");
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage("OTP must be 6 digits.");
      return;
    }

    try {
      setIsVerifying(true);
      clearMessages();

      await authApi.verifyEmail({
        email: cleanEmail,
        otp: otp.trim(),
      });

      setSuccessMessage("Email verified successfully.");

      setTimeout(() => {
        navigate(`/login?verified=true&email=${encodeURIComponent(cleanEmail)}`, {
          replace: true,
        });
      }, 800);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResendOtp() {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage("Enter your email before resending OTP.");
      return;
    }

    try {
      setIsResending(true);
      clearMessages();

      await authApi.resendEmailVerification(cleanEmail);

      setSuccessMessage("A new verification OTP has been sent to your email.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-page__aside" aria-label="GoldCraft verification">
        <Link to="/login" className="login-brand" aria-label="GoldCraft home">
          <span className="login-brand__mark">G</span>

          <span className="login-brand__text">
            <strong>GoldCraft</strong>
            <small>AI gold poster studio</small>
          </span>
        </Link>

        <div className="login-page__aside-content">
          <p className="login-page__eyebrow">Secure your workspace</p>

          <h1>Verify your email before creating gold posters.</h1>

          <p>
            Email verification protects your shop workspace and keeps your
            GoldCraft account ready for poster generation and gold rate updates.
          </p>
        </div>

        <div className="login-page__feature-list">
          <div className="login-page__feature-card">
            <span>01</span>
            <p>Enter the 6-digit OTP sent to your email</p>
          </div>

          <div className="login-page__feature-card">
            <span>02</span>
            <p>Verify your GoldCraft account securely</p>
          </div>

          <div className="login-page__feature-card">
            <span>03</span>
            <p>Sign in after verification</p>
          </div>
        </div>
      </section>

      <section
        className="login-page__form-section"
        aria-label="Verify email form"
      >
        <div className="login-card">
          <div className="login-card__header">
            <Link to="/login" className="login-card__mobile-brand">
              <span className="login-brand__mark">G</span>
              <span>GoldCraft</span>
            </Link>

            <p className="login-card__eyebrow">Email verification</p>

            <h2>Verify your email</h2>

            <p>
              Enter the 6-digit OTP sent to your email address to activate your
              GoldCraft account.
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

          <form className="login-form" onSubmit={handleVerifyEmail}>
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
              <span>Verification OTP</span>

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

            <button
              type="submit"
              className="login-form__submit"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify email"}
            </button>
          </form>

          <button
            type="button"
            className="login-card__secondary-button"
            onClick={handleResendOtp}
            disabled={isResending}
          >
            {isResending ? "Sending OTP..." : "Resend OTP"}
          </button>

          <p className="login-card__footer-text">
            Already verified? <Link to="/login">Sign in</Link>
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