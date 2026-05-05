import { useState } from "react";
import { Link } from "react-router-dom";

import { PublicNavbar } from "../components/PublicNavbar";

import "./PublicPages.css";

type BillingCycle = "monthly" | "yearly";

interface Plan {
  id: "plus" | "pro";
  name: string;
  badge: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  featured?: boolean;
}

const plans: Plan[] = [
  {
    id: "plus",
    name: "Plus",
    badge: "For starting shops",
    description: "Core GoldCraft tools for one jewellery shop.",
    monthlyPrice: "₹999",
    yearlyPrice: "₹9,999",
    features: [
      "Daily gold rate poster workflow",
      "AI poster generation foundation",
      "Shop profile management",
      "Poster history foundation",
      "Standard support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most useful",
    description: "Advanced tools for shops that post daily and need more reach.",
    monthlyPrice: "₹1,999",
    yearlyPrice: "₹19,999",
    featured: true,
    features: [
      "Everything in Plus",
      "Priority poster workflow",
      "Future WhatsApp sharing support",
      "Future Instagram sharing support",
      "Priority support",
    ],
  },
];

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <main className="public-page">
      <PublicNavbar />

      <section className="pricing-hero">
        <div className="public-page__frame">
          <div className="pricing-hero__header">
            <p className="public-eyebrow">Pricing</p>

            <h1>Choose the right GoldCraft plan.</h1>

            <p>
              Start with the plan that fits your jewellery shop today. Every
              plan is built around daily gold rate updates and professional
              jewellery marketing.
            </p>
          </div>

          <div
            className="billing-toggle"
            role="tablist"
            aria-label="Billing cycle"
          >
            <button
              type="button"
              aria-selected={billingCycle === "monthly"}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>

            <button
              type="button"
              aria-selected={billingCycle === "yearly"}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
            </button>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => {
              const price =
                billingCycle === "monthly"
                  ? plan.monthlyPrice
                  : plan.yearlyPrice;

              const suffix =
                billingCycle === "monthly" ? "/month + GST" : "/year + GST";

              return (
                <article
                  className={
                    plan.featured
                      ? "pricing-card pricing-card--featured"
                      : "pricing-card"
                  }
                  key={plan.id}
                >
                  <div className="pricing-card__badge">{plan.badge}</div>

                  <h2>{plan.name}</h2>

                  <p className="pricing-card__positioning">
                    {plan.description}
                  </p>

                  <div className="pricing-card__price">
                    <strong>{price}</strong>
                    <span>{suffix}</span>
                  </div>

                  <ul className="pricing-card__features">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>

                  <Link
                    to="/login"
                    className="public-button public-button--gold pricing-card__button"
                  >
                    Try out
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pricing-note">
        <strong>Note:</strong> This pricing page is public. Payment handling can
        be added later when your subscription backend is ready.
      </section>
    </main>
  );
}