import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { IJewellerRateOverrideRepository } from "@domain/repositories/IJewellerRateOverrideRepository";
import { ILogger } from "@application/interfaces/ILogger";
import { JewellerRateOverride } from "@domain/entities/JewellerRateOverride.entity";
import { AppError } from "@application/errors/AppError";

interface ShopRateOverrideInput {
  userId: string;
  rate22KPerGram?: number;
  rate18KPerGram?: number;
  silverPerGram?: number;
}

@injectable()
export class UpdateShopRateOverrideUseCase {
  constructor(
    @inject(TYPES.IShopRepository)
    private readonly shopRepository: IShopRepository,
    @inject(TYPES.IJewellerRateOverrideRepository)
    private readonly overrideRepository: IJewellerRateOverrideRepository,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public async execute(input: ShopRateOverrideInput) {
    this.logger.info(`Jeweller updating rate override for today (User ID: ${input.userId})`);

    const shopResult = await this.shopRepository.findByOwnerUserId(input.userId);
    if (shopResult.isFailure || !shopResult.getValue()) {
      throw new AppError("Shop profile not found for this user", 404, "SHOP_NOT_FOUND");
    }

    const shop = shopResult.getValue()!;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const overrideResult = JewellerRateOverride.create({
      shopId: shop.getId(),
      date: today,
      rate22KPerGram: input.rate22KPerGram,
      rate18KPerGram: input.rate18KPerGram,
      silverPerGram: input.silverPerGram,
      createdByUserId: input.userId,
    });

    if (overrideResult.isFailure) {
      throw new AppError(overrideResult.getError(), 400, "INVALID_OVERRIDE_DATA");
    }

    const override = overrideResult.getValue()!;
    const saveResult = await this.overrideRepository.save(override);

    if (saveResult.isFailure) {
      throw new AppError("Failed to save shop rate override", 500, "DB_ERROR");
    }
  }
}
