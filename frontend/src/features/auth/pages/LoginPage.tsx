import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Gem,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { clearAuthError, loginUser } from "../store/authSlice";
import type { LoginInput } from "../types/authTypes";

const authPoints = [
  "Create a polished digital presence for your jewellery shop",
  "Share offers, rates, and updates with customers faster",
  "Keep your shop profile and marketing tools in one workspace",
  "Built for jewellers who want a simpler way to grow online",
];

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

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
       * authSlice already stores the backend error in Redux.
       * So we do not manually set error here.
       */
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  }

  function togglePasswordVisibility() {
    setShowPassword((currentValue) => !currentValue);
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Link className="brand" to="/">
          <span className="brand__mark">
            <Gem size={17} />
          </span>

          <span className="brand__text">
            <strong>GoldCraft</strong>
            <small>Jewellery marketing</small>
          </span>
        </Link>

        <div className="auth-brand-panel__content">
          <span className="auth-badge">Jewellery growth suite</span>

          <h2>Bring your jewellery business online with GoldCraft</h2>

          <p>
            Set up your shop profile, manage your brand details, and prepare
            customer-ready marketing updates from one focused workspace.
          </p>
        </div>

        <div className="auth-points">
          {authPoints.map((point, index) => (
            <article className="auth-point" key={point}>
              {index === 1 ? <Sparkles size={18} /> : <ShieldCheck size={18} />}
              <span>{point}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="auth-form-area">
        <div className="login-panel">
          <div className="login-panel__header">
            <span className="auth-badge auth-badge--soft">Account login</span>

            <h1>Sign in to GoldCraft</h1>

            <p>
              Welcome back. Sign in to manage your jewellery business workspace.
            </p>
          </div>

          <div className="auth-social">
            <button
              className="button button--soft auth-social__button"
              onClick={handleGoogleLogin}
              type="button"
            >
              <span className="auth-social__icon" aria-hidden="true">
                G
              </span>
              Continue with Google
            </button>
          </div>

          <div className="auth-divider" aria-hidden="true">
            <span>or continue with email</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="form-field" htmlFor="email">
              <span>Email address</span>

              <div className="form-input">
                <Mail size={18} />

                <input
                  autoComplete="email"
                  id="email"
                  name="email"
                  onChange={handleInputChange}
                  placeholder="owner@yourshop.com"
                  required
                  type="email"
                  value={formData.email}
                />
              </div>
            </label>

            <label className="form-field" htmlFor="password">
              <span>Password</span>

              <div className="form-input">
                <Lock size={18} />

                <input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                />

                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <button
              className="button button--gold login-form__submit"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Signing in..." : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-links">
            <Link className="inline-link" to="/register">
              Need a new account? Register here
            </Link>

            <Link
              className="inline-link"
              to={`/forgot-password?email=${encodeURIComponent(
                formData.email
              )}`}
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}