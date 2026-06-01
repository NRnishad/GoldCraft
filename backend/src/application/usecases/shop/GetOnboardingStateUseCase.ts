import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IShopRepository } from "@domain/repositories/IShopRepository";

interface GetOnboardingStateInput {
  ownerUserId: string;
}

@injectable()
export class GetOnboardingStateUseCase {
  constructor(
    @inject(TYPES.IShopRepository)
    private readonly shopRepository: IShopRepository,
  ) {}

  public async execute(input: GetOnboardingStateInput) {
    const shopResult = await this.shopRepository.findByOwnerUserId(input.ownerUserId);

    if (shopResult.isFailure || !shopResult.getValue()) {
      return {
        shop: null,
        onboardingComplete: false,
        onboardingStep: 1,
      };
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
      },
      onboardingComplete: shop.getOnboardingComplete(),
      onboardingStep: shop.getOnboardingStep(),
    };
  }
}
