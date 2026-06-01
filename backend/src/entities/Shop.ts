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
  createdAt: Date;
  updatedAt: Date;
  profilePhotoKey?: string;
profilePhotoUrl?: string;
}