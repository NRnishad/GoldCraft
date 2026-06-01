import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { Phone } from "@domain/value-objects/Phone.vo";
import { Shop } from "@domain/entities/Shop.entity";
import { Result } from "@domain/shared/Result";
import { AppError } from "@application/errors/AppError";
import mongoose from "mongoose";

interface SaveOnboardingInput {
  ownerUserId: string;
  shopName: string;
  phone: string;
  city: string;
  address: string;
  tagline?: string;
}

@injectable()
export class SaveOnboardingUseCase {
  constructor(
    @inject(TYPES.IShopRepository)
    private readonly shopRepository: IShopRepository,
  ) {}

  public async execute(input: SaveOnboardingInput) {
    const phoneResult = Phone.create(input.phone);
    if (phoneResult.isFailure) {
      throw new AppError(phoneResult.getError(), 400, "INVALID_INPUT");
    }

    const phone = phoneResult.getValue();

    // Check if shop already exists
    const existingResult = await this.shopRepository.findByOwnerUserId(input.ownerUserId);
    let shop: Shop;

    if (existingResult.isSuccess && existingResult.getValue() !== null) {
      shop = existingResult.getValue()!;
      const updateResult = shop.updateProfileDetails({
        shopName: input.shopName,
        phone,
        city: input.city,
        address: input.address,
        tagline: input.tagline,
      });

      if (updateResult.isFailure) {
        throw new AppError(updateResult.getError(), 400, "INVALID_INPUT");
      }
    } else {
      const newShopResult = Shop.create({
        id: new mongoose.Types.ObjectId().toString(),
        ownerUserId: input.ownerUserId,
        shopName: input.shopName,
        phone,
        city: input.city,
        address: input.address,
        tagline: input.tagline,
      });

      if (newShopResult.isFailure) {
        throw new AppError(newShopResult.getError(), 400, "INVALID_INPUT");
      }

      shop = newShopResult.getValue()!;
    }

    // Progress onboarding to completion
    shop.completeOnboarding();

    // Save
    const saveResult = await this.shopRepository.save(shop);
    if (saveResult.isFailure) {
      throw new AppError("Failed to save onboarding details", 500, "DB_ERROR");
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
