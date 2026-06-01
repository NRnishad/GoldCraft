import {
  ISaveOnboardingShopRepository,
  SaveOnboardingData,
} from "./IShopRepository";
import { Shop } from "@entities/Shop";

export interface SaveOnboardingInput extends SaveOnboardingData {}

export interface SaveOnboardingOutput {
  shop: Shop;
}

export class SaveOnboardingUseCase {
  constructor(
    private readonly shopRepository: ISaveOnboardingShopRepository,
  ) {}

  async execute(input: SaveOnboardingInput): Promise<SaveOnboardingOutput> {
    const shop = await this.shopRepository.upsertOnboarding({
      ownerUserId: input.ownerUserId,
      shopName: input.shopName.trim(),
      phone: input.phone.trim(),
      city: input.city.trim(),
      address: input.address.trim(),
      tagline: input.tagline?.trim() || undefined,
    });

    return {
      shop,
    };
  }
}