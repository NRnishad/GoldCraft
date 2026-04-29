import { Shop } from "@entities/Shop";

export interface UpdateShopProfileData {
  ownerUserId: string;
  shopName?: string;
  phone?: string;
  city?: string;
  address?: string;
  tagline?: string;
}

export interface IUpdateShopProfileRepository {
  updateProfile(data: UpdateShopProfileData): Promise<Shop | null>;
}