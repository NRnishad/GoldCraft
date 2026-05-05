import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import "./AuthLayout.css";

interface AuthFeature {
  number: string;
  text: string;
}

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  features: AuthFeature[];
  children: ReactNode;
  formLabel: string;
}

export function AuthLayout({
  eyebrow,
  title,
  description,
  features,
  children,
  formLabel,
}: AuthLayoutProps) {
  return (
    <main className="auth-layout">
      <section className="auth-layout__aside" aria-label="GoldCraft overview">
        <Link to="/login" className="auth-brand" aria-label="GoldCraft home">
          <span className="auth-brand__mark">G</span>

          <span className="auth-brand__text">
            <strong>GoldCraft</strong>
            <small>AI gold poster studio</small>
          </span>
        </Link>

        <div className="auth-layout__aside-content">
          <p className="auth-layout__eyebrow">{eyebrow}</p>

          <h1>{title}</h1>

          <p>{description}</p>
        </div>

        <div className="auth-layout__feature-list">
          {features.map((feature) => (
            <div className="auth-layout__feature-card" key={feature.number}>
              <span>{feature.number}</span>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-layout__form-section" aria-label={formLabel}>
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}

interface AuthCardHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthCardHeader({
  eyebrow,
  title,
  description,
}: AuthCardHeaderProps) {
  return (
    <div className="auth-card__header">
      <Link to="/login" className="auth-card__mobile-brand">
        <span className="auth-brand__mark">G</span>
        <span>GoldCraft</span>
      </Link>

      <p className="auth-card__eyebrow">{eyebrow}</p>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}