import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import { shopApi } from "../api/shopApi";
import type { Shop, UpdateShopProfileInput } from "../types/shopTypes";

import "./ShopPages.css";

export function ShopProfilePage() {
  const [shop, setShop] = useState<Shop | null>(null);

  const [formData, setFormData] = useState<UpdateShopProfileInput>({
    shopName: "",
    phone: "",
    city: "",
    address: "",
    tagline: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await shopApi.getProfile();
        const loadedShop = response.data.data.shop;

        setShop(loadedShop);

        setFormData({
          shopName: loadedShop.shopName,
          phone: loadedShop.phone,
          city: loadedShop.city,
          address: loadedShop.address,
          tagline: loadedShop.tagline || "",
        });
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

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

    const cleanData: UpdateShopProfileInput = {
      shopName: formData.shopName?.trim(),
      phone: formData.phone?.trim(),
      city: formData.city?.trim(),
      address: formData.address?.trim(),
      tagline: formData.tagline?.trim() || undefined,
    };

    if (!cleanData.shopName || cleanData.shopName.length < 2) {
      setErrorMessage("Shop name must be at least 2 characters.");
      return;
    }

    if (!cleanData.phone || cleanData.phone.length < 8) {
      setErrorMessage("Phone must be at least 8 characters.");
      return;
    }

    if (!cleanData.city || cleanData.city.length < 2) {
      setErrorMessage("City must be at least 2 characters.");
      return;
    }

    if (!cleanData.address || cleanData.address.length < 5) {
      setErrorMessage("Address must be at least 5 characters.");
      return;
    }

    if (cleanData.tagline && cleanData.tagline.length > 150) {
      setErrorMessage("Tagline must be 150 characters or less.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await shopApi.updateProfile(cleanData);
      const updatedShop = response.data.data.shop;

      setShop(updatedShop);

      setFormData({
        shopName: updatedShop.shopName,
        phone: updatedShop.phone,
        city: updatedShop.city,
        address: updatedShop.address,
        tagline: updatedShop.tagline || "",
      });

      setSuccessMessage("Shop profile updated successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="shop-loading">Loading shop profile...</p>;
  }

  if (!shop && errorMessage) {
    return (
      <section className="shop-page">
        <div className="shop-page__header">
          <p className="shop-page__eyebrow">Shop profile</p>

          <h1>Shop profile not ready</h1>

          <p>{errorMessage}</p>
        </div>

        <Link to="/shop/onboarding" className="shop-button shop-button--primary">
          Complete onboarding
        </Link>
      </section>
    );
  }

  return (
    <section className="shop-page">
      <div className="shop-page__header">
        <p className="shop-page__eyebrow">Shop profile</p>

        <h1>Manage your shop details</h1>

        <p>
          Keep your shop information updated. These details can be used later in
          GoldCraft posters and business pages.
        </p>
      </div>

      {shop && (
        <div className="shop-profile-summary">
          <div className="shop-profile-summary__avatar" aria-hidden="true">
            {shop.profilePhotoUrl ? (
              <img src={shop.profilePhotoUrl} alt="" />
            ) : (
              getShopInitial(shop.shopName)
            )}
          </div>

          <div>
            <h2>{shop.shopName}</h2>
            <p>
              {shop.city} · {shop.phone}
            </p>
            {shop.tagline && <p>{shop.tagline}</p>}
          </div>
        </div>
      )}

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
                  value={formData.shopName || ""}
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
                    value={formData.phone || ""}
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
                    value={formData.city || ""}
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
                  value={formData.address || ""}
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
                  Optional. Keep it short and suitable for posters.
                </p>
              </label>
            </div>
          </div>

          <div className="shop-card__footer">
            <Link to="/shop/onboarding" className="shop-button shop-button--secondary">
              View onboarding
            </Link>

            <button
              type="submit"
              className="shop-button shop-button--primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving changes..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function getShopInitial(shopName: string): string {
  return shopName.trim().charAt(0).toUpperCase() || "G";
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