import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { AppError } from "@application/errors/AppError";

interface UpdatePhotoInput {
  ownerUserId: string;
  profilePhotoKey: string;
  profilePhotoUrl: string;
}

@injectable()
export class UpdateShopProfilePhotoUseCase {
  constructor(
    @inject(TYPES.IShopRepository)
    private readonly shopRepository: IShopRepository,
  ) {}

  public async execute(input: UpdatePhotoInput) {
    const shopResult = await this.shopRepository.findByOwnerUserId(input.ownerUserId);
    if (shopResult.isFailure || !shopResult.getValue()) {
      throw new AppError("Shop profile not found", 404, "SHOP_NOT_FOUND");
    }

    const shop = shopResult.getValue()!;
    
    // Mutate domain entity
    shop.updateProfilePhoto(input.profilePhotoKey, input.profilePhotoUrl);

    // If they are in the middle of onboarding step 2 (upload photo), step up
    if (shop.getOnboardingStep() === 2) {
      shop.setOnboardingStep(3);
    }

    // Save changes
    const saveResult = await this.shopRepository.save(shop);
    if (saveResult.isFailure) {
      throw new AppError("Failed to update profile photo in database", 500, "DB_ERROR");
    }

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
      },
    };
  }
}
