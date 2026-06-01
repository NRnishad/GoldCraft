import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { AppError } from "@application/errors/AppError";

interface GetShopProfileInput {
  ownerUserId: string;
}

@injectable()
export class GetShopProfileUseCase {
  constructor(
    @inject(TYPES.IShopRepository)
    private readonly shopRepository: IShopRepository,
  ) {}

  public async execute(input: GetShopProfileInput) {
    const shopResult = await this.shopRepository.findByOwnerUserId(input.ownerUserId);
    if (shopResult.isFailure || !shopResult.getValue()) {
      throw new AppError("Shop profile not found", 404, "SHOP_NOT_FOUND");
    }

    const shop = shopResult.getValue()!;

    return {
      shop: {
        id: shop.getId(),
        ownerUserId: shop.getOwnerUserId(),
        shopName: shop.getShopName(),
        phone: shop.getPhone().getValue(),
        city: shop.getCity(),
        address: shop.getAddress(),
        tagline: shop.getTagline(),
        onboardingComplete: shop.getOnboardingComplete(),
        onboardingStep: shop.getOnboardingStep(),
        profilePhotoKey: shop.getProfilePhotoKey(),
        profilePhotoUrl: shop.getProfilePhotoUrl(),
        createdAt: shop.getCreatedAt(),
        updatedAt: shop.getUpdatedAt(),
      },
    };
  }
}
