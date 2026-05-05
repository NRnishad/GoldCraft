export interface Shop {
  id: string;
  ownerUserId: string;
  shopName: string;
  phone: string;
  city: string;
  address: string;
  tagline?: string;
  onboardingComplete: boolean;
  onboardingStep: number;
  profilePhotoKey?: string;
  profilePhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopOnboardingInput {
  shopName: string;
  phone: string;
  city: string;
  address: string;
  tagline?: string;
}

export interface UpdateShopProfileInput {
  shopName?: string;
  phone?: string;
  city?: string;
  address?: string;
  tagline?: string;
}

export interface GetOnboardingStateResponse {
  success: boolean;
  message: string;
  data: {
    shop: Shop | null;
    onboardingComplete: boolean;
    onboardingStep: number;
  };
}

export interface SaveOnboardingResponse {
  success: boolean;
  message: string;
  data: {
    shop: Shop;
  };
}

export interface GetShopProfileResponse {
  success: boolean;
  message: string;
  data: {
    shop: Shop;
  };
}

export interface UpdateShopProfileResponse {
  success: boolean;
  message: string;
  data: {
    shop: Shop;
  };
}

