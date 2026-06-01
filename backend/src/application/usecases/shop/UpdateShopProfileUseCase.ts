import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { Phone } from "@domain/value-objects/Phone.vo";
import { AppError } from "@application/errors/AppError";

interface UpdateShopProfileInput {
  ownerUserId: string;
  shopName?: string;
  phone?: string;
  city?: string;
  address?: string;
  tagline?: string;
}

@injectable()
export class UpdateShopProfileUseCase {
  constructor(
    @inject(TYPES.IShopRepository)
    private readonly shopRepository: IShopRepository,
  ) {}

  public async execute(input: UpdateShopProfileInput) {
    const shopResult = await this.shopRepository.findByOwnerUserId(input.ownerUserId);
    if (shopResult.isFailure || !shopResult.getValue()) {
      throw new AppError("Shop profile not found", 404, "SHOP_NOT_FOUND");
    }

    const shop = shopResult.getValue()!;

    // Resolve phone: use provided input or keep existing
    const phoneStr = input.phone ?? shop.getPhone().getValue();
    const phoneResult = Phone.create(phoneStr);
    if (phoneResult.isFailure) {
      throw new AppError(phoneResult.getError(), 400, "INVALID_INPUT");
    }

    const updateResult = shop.updateProfileDetails({
      shopName: input.shopName ?? shop.getShopName(),
      phone: phoneResult.getValue()!,
      city: input.city ?? shop.getCity(),
      address: input.address ?? shop.getAddress(),
      tagline: input.tagline !== undefined ? input.tagline : shop.getTagline(),
    });

    if (updateResult.isFailure) {
      throw new AppError(updateResult.getError(), 400, "INVALID_INPUT");
    }

    const saveResult = await this.shopRepository.save(shop);
    if (saveResult.isFailure) {
      throw new AppError("Failed to update shop details in database", 500, "DB_ERROR");
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
