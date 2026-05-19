import { useEffect, useState, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import Cropper from "react-easy-crop";

import { shopApi } from "../api/shopApi";
import type { Shop, UpdateShopProfileInput } from "../types/shopTypes";
import "./ShopPages.css";

export function ShopProfilePage() {
  const [shop, setShop] = useState<Shop | null>(null);

  const [formData, setFormData] = useState<UpdateShopProfileInput>({
    shopName: "", phone: "", city: "", address: "", tagline: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // [NEW] State to track if the user is in edit mode
  const [isEditing, setIsEditing] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Image Upload & Crop State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const response = await shopApi.getProfile();
        const loadedShop = response.data.data.shop;
        setShop(loadedShop);
        setFormData({
          shopName: loadedShop.shopName, phone: loadedShop.phone,
          city: loadedShop.city, address: loadedShop.address,
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

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // [NEW] If we are not editing, just turn edit mode on and stop.
    if (!isEditing) {
      setIsEditing(true);
      return; 
    }

    // [EXISTING VALIDATION LOGIC]
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
    if (!cleanData.phone || !/^\d{10}$/.test(cleanData.phone)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
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
      setIsEditing(false); // [NEW] Lock the form again after successful save
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  // --- IMAGE UPLOAD LOGIC ---
  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    // [NEW] Don't allow photo changes if not in edit mode
    if (!isEditing) return;

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  async function handleCropSave() {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploadingPhoto(true);
      setErrorMessage(null);

      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const urlResponse = await shopApi.getProfilePhotoUploadUrl("profile.jpg", "image/jpeg");
      const { uploadUrl, fileKey, publicUrl } = urlResponse.data.data; 

      await shopApi.uploadToS3(uploadUrl, croppedImageBlob, "image/jpeg");
      await shopApi.updateProfilePhoto(publicUrl, fileKey);

      setShop((prev) => prev ? { ...prev, profilePhotoUrl: publicUrl } : null);
      setImageSrc(null); 
      setSuccessMessage("Profile photo updated successfully!");

    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  if (isLoading) return <p className="shop-loading">Loading shop profile...</p>;

  return (
    <section className="shop-page">
      <div className="shop-page__header">
        <p className="shop-page__eyebrow">Shop profile</p>
        <h1>Manage your shop details</h1>
      </div>

      {shop && (
        <div className="shop-profile-summary">
          <div className="shop-profile-summary__avatar" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* [NEW] Only show pointer cursor and Edit overlay if in edit mode */}
            <label htmlFor="photo-upload" style={{ cursor: isEditing ? 'pointer' : 'default', display: 'block', width: '100%', height: '100%' }}>
              <img 
                 src={shop.profilePhotoUrl || "https://heerabhai.com/wp-content/uploads/2025/01/necklace.png"} 
                 alt="Shop Logo" 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {isEditing && (
                <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', textAlign: 'center', fontSize: '12px', padding: '4px 0'}}>
                  Change
                </div>
              )}
            </label>
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              onChange={onFileChange} 
              style={{ display: 'none' }} 
              disabled={!isEditing} // [NEW] Disable input if not editing
            />
          </div>

          <div>
            <h2>{shop.shopName}</h2>
            <p>{shop.city} · {shop.phone}</p>
          </div>
        </div>
      )}

      {/* CROPPER MODAL (Unchanged) */}
      {imageSrc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '500px', height: '400px', background: '#333' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} 
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
             <button onClick={() => setImageSrc(null)} disabled={isUploadingPhoto} className="shop-button shop-button--secondary">Cancel</button>
             <button onClick={handleCropSave} disabled={isUploadingPhoto} className="shop-button shop-button--primary">
                {isUploadingPhoto ? "Uploading..." : "Save Photo"}
             </button>
          </div>
        </div>
      )}

      {/* PROFILE FORM */}
      <div className="shop-card">
        <form onSubmit={handleSubmit}>
          <div className="shop-card__body">
            {errorMessage && <div className="shop-message shop-message--error" role="alert">{errorMessage}</div>}
            {successMessage && <div className="shop-message shop-message--success" role="status">{successMessage}</div>}
            
            <div className="shop-form">
              <label className="shop-form__field" htmlFor="shopName">
                <span>Shop name</span>
                {/* [NEW] Added disabled prop tied to isEditing */}
                <input id="shopName" name="shopName" type="text" value={formData.shopName || ""} onChange={handleInputChange} required disabled={!isEditing} />
              </label>

              <div className="shop-form__grid">
                <label className="shop-form__field" htmlFor="phone">
                  <span>Phone number</span>
                  <input id="phone" name="phone" type="tel" value={formData.phone || ""} onChange={handleInputChange} required disabled={!isEditing} />
                </label>

                <label className="shop-form__field" htmlFor="city">
                  <span>City</span>
                  <input id="city" name="city" type="text" value={formData.city || ""} onChange={handleInputChange} required disabled={!isEditing} />
                </label>
              </div>

              <label className="shop-form__field" htmlFor="address">
                <span>Shop address</span>
                <textarea id="address" name="address" value={formData.address || ""} onChange={handleInputChange} required disabled={!isEditing} />
              </label>

              <label className="shop-form__field" htmlFor="tagline">
                <span>Tagline</span>
                <input id="tagline" name="tagline" type="text" value={formData.tagline || ""} onChange={handleInputChange} maxLength={150} disabled={!isEditing} />
                {isEditing && <p className="shop-form__help">Optional. Keep it short and suitable for posters.</p>}
              </label>
            </div>
          </div>
          <div className="shop-card__footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {/* [NEW] Removed Onboarding Link. Added Cancel Edit Button */}
            {isEditing && (
               <button 
                 type="button" 
                 className="shop-button shop-button--secondary" 
                 onClick={() => {
                   setIsEditing(false);
                   setErrorMessage(null);
                   setSuccessMessage(null);
                   // Reset form to last saved shop state
                   if (shop) {
                     setFormData({
                       shopName: shop.shopName, phone: shop.phone,
                       city: shop.city, address: shop.address,
                       tagline: shop.tagline || "",
                     });
                   }
                 }}
               >
                 Cancel
               </button>
            )}
            
            
            <button type="submit" className="shop-button shop-button--primary" disabled={isSaving}>
              {!isEditing ? "Edit Profile" : isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function getErrorMessage(error: any): string {
  return error?.response?.data?.message || "Something went wrong. Please try again.";
}


async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("Canvas is empty"));
      else resolve(blob);
    }, "image/jpeg", 0.9);
  });
}