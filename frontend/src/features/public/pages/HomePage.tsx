import { Link } from "react-router-dom";

import { PublicNavbar } from "../components/PublicNavbar";

import "./PublicPages.css";

const features = [
  {
    icon: "01",
    title: "Daily gold rate posters",
    description:
      "Create clean gold rate posters for WhatsApp, Instagram, and your customers without manual design work every morning.",
  },
  {
    icon: "02",
    title: "AI poster workflow",
    description:
      "Prepare branded jewellery business posters using your shop details, tagline, and daily gold rate content.",
  },
  {
    icon: "03",
    title: "Shop profile",
    description:
      "Keep your jewellery shop information ready for posters, public display, and future customer-facing pages.",
  },
  {
    icon: "04",
    title: "Admin control",
    description:
      "Manage users, roles, account access, and platform safety from a clean admin dashboard.",
  },
];

const steps = [
  {
    title: "Set up your shop",
    description:
      "Create your account, verify email with OTP, and complete shop onboarding.",
  },
  {
    title: "Prepare gold rate content",
    description:
      "Use GoldCraft to organize daily gold rate update content for your jewellery customers.",
  },
  {
    title: "Generate and share",
    description:
      "Create professional posters and share them through your daily customer channels.",
  },
];

export function HomePage() {
  return (
    <main className="public-page">
      <PublicNavbar />

      <section className="public-hero">
        <div className="public-page__frame public-hero__grid">
          <div>
            <p className="public-eyebrow">GoldCraft for jewellery businesses</p>

            <h1>Daily gold-rate marketing made simple.</h1>

            <p className="public-hero__description">
              GoldCraft helps jewellery shops create daily gold rate update
              posters, manage shop details, and prepare AI-powered promotional
              content from one professional dashboard.
            </p>

            <div className="public-hero__actions">
              <Link to="/login" className="public-button public-button--gold">
                Try out
              </Link>

              <Link
                to="/pricing"
                className="public-button public-button--outline"
              >
                See pricing
              </Link>
            </div>

            <div className="public-hero__meta">
              <span>OTP-secured accounts</span>
              <span>Jewellery shop dashboard</span>
              <span>Daily poster workflow</span>
            </div>
          </div>

          <aside className="poster-preview" aria-label="Sample gold rate poster">
            <div className="poster-preview__card">
              <div className="poster-preview__rings" aria-hidden="true" />

              <div className="poster-preview__shop">
                <strong>Malabar Jewels</strong>
                <span>Daily gold rate update</span>
              </div>

              <div className="poster-preview__rates">
                <div className="poster-preview__rate poster-preview__rate--primary">
                  <span>22K Gold</span>
                  <strong>₹6,820</strong>
                </div>

                <div className="poster-preview__rate">
                  <span>18K Gold</span>
                  <strong>₹5,620</strong>
                </div>
              </div>

              <div className="poster-preview__footer">
                <span>Today&apos;s Rate</span>
                <div className="poster-preview__qr" aria-hidden="true" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="public-section public-section--white">
        <div className="public-page__frame">
          <p className="public-eyebrow">Features</p>

          <h2>Everything needed for jewellery shop marketing.</h2>

          <p className="public-section__intro">
            Start with shop setup and user management now. Then build toward
            gold rate posters, AI poster generation, and public customer pages.
          </p>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card__icon">{feature.icon}</div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-page__frame">
          <p className="public-eyebrow">How it works</p>

          <h2>From shop setup to daily poster workflow.</h2>

          <div className="process-row">
            {steps.map((step, index) => (
              <article className="process-step" key={step.title}>
                <div className="process-step__number">{index + 1}</div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}