import { Shop } from "@entities/Shop";
import { IGetOnboardingStateShopRepository } from "./IShopRepository";

export interface GetOnboardingStateInput {
  ownerUserId: string;
}

export interface GetOnboardingStateOutput {
  shop: Shop | null;
  onboardingComplete: boolean;
  onboardingStep: number;
}

export class GetOnboardingStateUseCase {
  constructor(
    private readonly shopRepository: IGetOnboardingStateShopRepository,
  ) {}

  async execute(
    input: GetOnboardingStateInput,
  ): Promise<GetOnboardingStateOutput> {
    const shop = await this.shopRepository.findByOwnerUserId(input.ownerUserId);

    if (!shop) {
      return {
        shop: null,
        onboardingComplete: false,
        onboardingStep: 1,
      };
    }

    return {
      shop,
      onboardingComplete: shop.onboardingComplete,
      onboardingStep: shop.onboardingStep,
    };
  }
}