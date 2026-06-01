import { Shop } from "@entities/Shop";
import { IGetShopProfileRepository } from "./IShopRepository";

export interface GetShopProfileInput {
  ownerUserId: string;
}

export interface GetShopProfileOutput {
  shop: Shop;
}

export class GetShopProfileUseCase {
  constructor(private readonly shopRepository: IGetShopProfileRepository) {}

  async execute(input: GetShopProfileInput): Promise<GetShopProfileOutput> {
    const shop = await this.shopRepository.findByOwnerUserId(input.ownerUserId);

    if (!shop) {
      throw new Error("SHOP_NOT_FOUND");
    }

    return {
      shop,
    };
  }
}