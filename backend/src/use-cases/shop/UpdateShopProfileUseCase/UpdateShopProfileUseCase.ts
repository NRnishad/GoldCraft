import { Shop } from "@entities/Shop";
import { IShopRepository } from "./IShopRepository";

export interface UpdateShopProfileInput {
  ownerUserId: string;
  shopName?: string;
  phone?: string;
  city?: string;
  address?: string;
  tagline?: string;
}

export interface UpdateShopProfileOutput {
  shop: Shop;
}

export class UpdateShopProfileUseCase {
  constructor(private readonly shopRepository: IShopRepository) {}

  async execute(input: UpdateShopProfileInput): Promise<UpdateShopProfileOutput> {
    const shop = await this.shopRepository.updateProfile({
      ownerUserId: input.ownerUserId,
      shopName: input.shopName,
      phone: input.phone,
      city: input.city,
      address: input.address,
      tagline: input.tagline,
    });

    if (!shop) {
      throw new Error("SHOP_NOT_FOUND");
    }

    return { shop };
  }
}