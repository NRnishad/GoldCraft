import { Shop } from "@entities/Shop";
import {
  IUpdateShopProfileRepository,
  UpdateShopProfileData,
} from "./IShopRepository";

export interface UpdateShopProfileInput extends UpdateShopProfileData {}

export interface UpdateShopProfileOutput {
  shop: Shop;
}

export class UpdateShopProfileUseCase {
  constructor(private readonly shopRepository: IUpdateShopProfileRepository) {}

  async execute(
    input: UpdateShopProfileInput,
  ): Promise<UpdateShopProfileOutput> {
    const shop = await this.shopRepository.updateProfile({
      ownerUserId: input.ownerUserId,
      shopName: input.shopName?.trim(),
      phone: input.phone?.trim(),
      city: input.city?.trim(),
      address: input.address?.trim(),
      tagline: input.tagline?.trim(),
    });

    if (!shop) {
      throw new Error("SHOP_NOT_FOUND");
    }

    return {
      shop,
    };
  }
}