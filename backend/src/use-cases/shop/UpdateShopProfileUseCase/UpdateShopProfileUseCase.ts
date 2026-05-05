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
  constructor(private readonly shopRepository: IUpdateShopProfilePhotoRepository) {}

  async execute(
    input: UpdateShopProfilePhotoInput,
  ): Promise<UpdateShopProfilePhotoOutput> {
    const profilePhotoKey = input.profilePhotoKey.trim();
    const profilePhotoUrl = input.profilePhotoUrl.trim();

    const expectedPrefix = `shops/${input.ownerUserId}/profile/`;

    if (!profilePhotoKey.startsWith(expectedPrefix)) {
      throw new Error("INVALID_PROFILE_PHOTO_KEY");
    }

    if (!profilePhotoUrl) {
      throw new Error("INVALID_PROFILE_PHOTO_URL");
    }

    const shop = await this.shopRepository.updateProfilePhoto({
      ownerUserId: input.ownerUserId,
      profilePhotoKey,
      profilePhotoUrl,
    });

    if (!shop) {
      throw new Error("SHOP_NOT_FOUND");
    }

    return { shop };
  }
}