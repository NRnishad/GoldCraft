import { Shop } from "@entities/Shop";

export interface SaveOnboardingData {
  ownerUserId: string;
  shopName: string;
  phone: string;
  city: string;
  address: string;
  tagline?: string;
}

export interface ISaveOnboardingShopRepository {
  upsertOnboarding(data: SaveOnboardingData): Promise<Shop>;
}