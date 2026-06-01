import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { IGoldRateRepository } from "@domain/repositories/IGoldRateRepository";
import { IJewellerRateOverrideRepository } from "@domain/repositories/IJewellerRateOverrideRepository";
import { ILogger } from "@application/interfaces/ILogger";
import { AppError } from "@application/errors/AppError";

@injectable()
export class GetShopTodayRateUseCase {
  constructor(
    @inject(TYPES.IShopRepository)
    private readonly shopRepository: IShopRepository,
    @inject(TYPES.IGoldRateRepository)
    private readonly goldRateRepository: IGoldRateRepository,
    @inject(TYPES.IJewellerRateOverrideRepository)
    private readonly overrideRepository: IJewellerRateOverrideRepository,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public async execute(userId: string) {
    this.logger.info(`Fetching effective today's rate for Jeweller (User ID: ${userId})`);

    const shopResult = await this.shopRepository.findByOwnerUserId(userId);
    if (shopResult.isFailure || !shopResult.getValue()) {
      throw new AppError("Your Shop profile was not found. Have you completed onboarding?", 404, "SHOP_NOT_FOUND");
    }

    const shop = shopResult.getValue()!;

    const globalRateResult = await this.goldRateRepository.findLatest();
    if (globalRateResult.isFailure || !globalRateResult.getValue()) {
      throw new AppError("No market rates have been published yet by the Admin.", 404, "RATES_NOT_FOUND");
    }

    const globalRate = globalRateResult.getValue()!;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const overrideResult = await this.overrideRepository.findByShopAndDate(shop.getId(), today);
    const override = overrideResult.isSuccess ? overrideResult.getValue() : null;

    const rate22KPerGram = override?.getRate22KPerGram() || globalRate.getRate22KPerGram();
    const rate18KPerGram = override?.getRate18KPerGram() || globalRate.getRate18KPerGram();
    const silverPerGram = override?.getSilverPerGram() || globalRate.getSilverPerGram();

    return {
      date: globalRate.getDate(),
      rate22KPerGram,
      rate22KPer8Gram: rate22KPerGram * 8,
      rate18KPerGram,
      rate18KPer8Gram: rate18KPerGram * 8,
      silverPerGram,
      silverPer8Gram: silverPerGram * 8,
      isOverridden: !!override,
    };
  }
}
