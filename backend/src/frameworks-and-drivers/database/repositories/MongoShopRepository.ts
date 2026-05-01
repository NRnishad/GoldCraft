import { Shop } from "@entities/Shop";
import { IGetOnboardingStateShopRepository } from "@use-cases/shop/GetOnboardingStateUseCase/IShopRepository";
import {
  ISaveOnboardingShopRepository,
  SaveOnboardingData,
} from "@use-cases/shop/SaveOnboardingUseCase/IShopRepository";
import { IGetShopProfileRepository } from "@use-cases/shop/GetShopProfileUseCase/IShopRepository";
import {
  IUpdateShopProfileRepository,
  UpdateShopProfileData,
} 
from "@use-cases/shop/UpdateShopProfileUseCase/IShopRepository";
import { IShopDocument, ShopModel } from "../models/ShopModel";
import { IUpdateShopProfilePhotoRepository } from "@use-cases/shop/UpdateShopProfilePhotoUseCase/IShopRepository";

export class MongoShopRepository
  implements
    IGetOnboardingStateShopRepository,
    ISaveOnboardingShopRepository,
    IGetShopProfileRepository,
    IUpdateShopProfileRepository,
    IUpdateShopProfilePhotoRepository
{
  async findByOwnerUserId(ownerUserId: string): Promise<Shop | null> {
    const shop = await ShopModel.findOne({ ownerUserId }).exec();

    if (!shop) {
      return null;
    }

    return this.toEntity(shop);
  }

  async upsertOnboarding(data: SaveOnboardingData): Promise<Shop> {
    const shop = await ShopModel.findOneAndUpdate(
      {
        ownerUserId: data.ownerUserId,
      },
      {
        $set: {
          shopName: data.shopName.trim(),
          phone: data.phone.trim(),
          city: data.city.trim(),
          address: data.address.trim(),
          tagline: data.tagline?.trim() || undefined,
          onboardingComplete: true,
          onboardingStep: 3,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).exec();

    if (!shop) {
      throw new Error("SHOP_SAVE_FAILED");
    }

    return this.toEntity(shop);
  }

  async updateProfile(data: UpdateShopProfileData): Promise<Shop | null> {
    const updateData: Partial<{
      shopName: string;
      phone: string;
      city: string;
      address: string;
      tagline: string;
    }> = {};

    if (data.shopName !== undefined) {
      updateData.shopName = data.shopName.trim();
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone.trim();
    }

    if (data.city !== undefined) {
      updateData.city = data.city.trim();
    }

    if (data.address !== undefined) {
      updateData.address = data.address.trim();
    }

    if (data.tagline !== undefined) {
      updateData.tagline = data.tagline.trim();
    }

    const shop = await ShopModel.findOneAndUpdate(
      {
        ownerUserId: data.ownerUserId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
      },
    ).exec();

    if (!shop) {
      return null;
    }

    return this.toEntity(shop);
  }
  async updateProfilePhoto(input: {
  ownerUserId: string;
  profilePhotoKey: string;
  profilePhotoUrl: string;
}): Promise<Shop | null> {
  const shop = await ShopModel.findOneAndUpdate(
    {
      ownerUserId: input.ownerUserId,
    },
    {
      $set: {
        profilePhotoKey: input.profilePhotoKey,
        profilePhotoUrl: input.profilePhotoUrl,
      },
    },
    {
      new: true,
    },
  ).exec();

  if (!shop) {
    return null;
  }

  return this.toEntity(shop);
}

  private toEntity(shop: IShopDocument): Shop {
  return {
    id: String(shop._id),
    ownerUserId: String(shop.ownerUserId),
    shopName: shop.shopName,
    phone: shop.phone,
    city: shop.city,
    address: shop.address,
    tagline: shop.tagline,
    profilePhotoKey: shop.profilePhotoKey,
    profilePhotoUrl: shop.profilePhotoUrl,
    onboardingComplete: shop.onboardingComplete,
    onboardingStep: shop.onboardingStep,
    createdAt: shop.createdAt,
    updatedAt: shop.updatedAt,
  };
}
}