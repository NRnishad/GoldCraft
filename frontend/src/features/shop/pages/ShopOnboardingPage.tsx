import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { shopApi } from "../api/shopApi";
import type { ShopOnboardingInput } from "../types/shopTypes";

import "./ShopPages.css";

export function ShopOnboardingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ShopOnboardingInput>({
    shopName: "",
    phone: "",
    city: "",
    address: "",
    tagline: "",
  });

  const [isCheckingState, setIsCheckingState] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadOnboardingState() {
      try {
        setIsCheckingState(true);

        const response = await shopApi.getOnboardingState();
        const { shop, onboardingComplete } = response.data.data;

        if (shop) {
          setFormData({
            shopName: shop.shopName,
            phone: shop.phone,
            city: shop.city,
            address: shop.address,
            tagline: shop.tagline || "",
          });
        }

        if (onboardingComplete && shop) {
          navigate("/shop/profile", { replace: true });
        }
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsCheckingState(false);
      }
    }

    loadOnboardingState();
  }, [navigate]);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanData: ShopOnboardingInput = {
      shopName: formData.shopName.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      tagline: formData.tagline?.trim() || undefined,
    };

    if (cleanData.shopName.length < 2) {
      setErrorMessage("Shop name must be at least 2 characters.");
      return;
    }

    if (cleanData.phone.length < 8) {
      setErrorMessage("Phone must be at least 8 characters.");
      return;
    }

    if (cleanData.city.length < 2) {
      setErrorMessage("City must be at least 2 characters.");
      return;
    }

    if (cleanData.address.length < 5) {
      setErrorMessage("Address must be at least 5 characters.");
      return;
    }

    if (cleanData.tagline && cleanData.tagline.length > 150) {
      setErrorMessage("Tagline must be 150 characters or less.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await shopApi.saveOnboarding(cleanData);

      setSuccessMessage("Shop onboarding completed successfully.");

      setTimeout(() => {
        navigate("/shop/profile", { replace: true });
      }, 700);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingState) {
    return <p className="shop-loading">Checking onboarding state...</p>;
  }

  return (
    <section className="shop-page">
      <div className="shop-page__header">
        <p className="shop-page__eyebrow">Shop onboarding</p>

        <h1>Set up your jewellery shop</h1>

        <p>
          Add the basic shop details GoldCraft needs before you create gold rate
          posters and manage your shop profile.
        </p>
      </div>

      <div className="shop-card">
        <form onSubmit={handleSubmit}>
          <div className="shop-card__body">
            {errorMessage && (
              <div className="shop-message shop-message--error" role="alert">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="shop-message shop-message--success" role="status">
                {successMessage}
              </div>
            )}

            <div className="shop-form">
              <label className="shop-form__field" htmlFor="shopName">
                <span>Shop name</span>

                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="Example: Nishad Gold Palace"
                  autoComplete="organization"
                  required
                />
              </label>

              <div className="shop-form__grid">
                <label className="shop-form__field" htmlFor="phone">
                  <span>Phone number</span>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Example: 9876543210"
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className="shop-form__field" htmlFor="city">
                  <span>City</span>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Example: Thrissur"
                    autoComplete="address-level2"
                    required
                  />
                </label>
              </div>

              <label className="shop-form__field" htmlFor="address">
                <span>Shop address</span>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full shop address"
                  autoComplete="street-address"
                  required
                />
              </label>

              <label className="shop-form__field" htmlFor="tagline">
                <span>Tagline</span>

                <input
                  id="tagline"
                  name="tagline"
                  type="text"
                  value={formData.tagline || ""}
                  onChange={handleInputChange}
                  placeholder="Example: Trusted jewellery since 1998"
                  maxLength={150}
                />

                <p className="shop-form__help">
                  Optional. This can be used later in your poster designs.
                </p>
              </label>
            </div>
          </div>

          <div className="shop-card__footer">
            <button
              type="submit"
              className="shop-button shop-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving shop..." : "Complete onboarding"}
            </button>
          </div>
        </form>
      </div>
    </section>
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