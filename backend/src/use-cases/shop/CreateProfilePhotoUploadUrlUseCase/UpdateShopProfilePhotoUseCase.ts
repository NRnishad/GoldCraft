import { Shop } from "@entities/Shop";
import { IUpdateShopProfilePhotoRepository } from "./IShopRepository";

export interface UpdateShopProfilePhotoInput {
  ownerUserId: string;
  profilePhotoKey: string;
  profilePhotoUrl: string;
}

export interface UpdateShopProfilePhotoOutput {
  shop: Shop;
}

export class UpdateShopProfilePhotoUseCase {
  constructor(
    private readonly shopRepository: IUpdateShopProfilePhotoRepository,
  ) {}

  async execute(
    input: UpdateShopProfilePhotoInput,
  ): Promise<UpdateShopProfilePhotoOutput> {
    const shop = await this.shopRepository.updateProfilePhoto({
      ownerUserId: input.ownerUserId,
      profilePhotoKey: input.profilePhotoKey.trim(),
      profilePhotoUrl: input.profilePhotoUrl.trim(),
    });

    if (!shop) {
      throw new Error("SHOP_NOT_FOUND");
    }

    return {
      shop,
    };
  }
}