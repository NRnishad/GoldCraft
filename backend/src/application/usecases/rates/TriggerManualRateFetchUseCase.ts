import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IMetalRatesApiService } from "@application/interfaces/IMetalRatesApiService";
import { IGoldRateRepository } from "@domain/repositories/IGoldRateRepository";
import { ILogger } from "@application/interfaces/ILogger";
import { GoldRate, RateSource } from "@domain/entities/GoldRate.entity";
import { AppError } from "@application/errors/AppError";

@injectable()
export class TriggerManualRateFetchUseCase {
  constructor(
    @inject(TYPES.IMetalRatesApiService)
    private readonly apiService: IMetalRatesApiService,
    @inject(TYPES.IGoldRateRepository)
    private readonly goldRateRepository: IGoldRateRepository,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public async execute() {
    this.logger.info("Admin triggering manual live metal rates fetch");

    const apiResult = await this.apiService.fetchTodayRates();
    const rates = apiResult.data;

    if (!rates) {
      throw new AppError("No metal rates data received from provider API", 502, "API_ERROR");
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const rate22KPerGram = rates.gold["22k"];
    const rate18KPerGram = rates.gold["18k"];
    const silverPerGram = rates.silver["999"];

    // Use our rich domain model validation
    const goldRateResult = GoldRate.create({
      date: today,
      rate22KPerGram,
      rate22KPer8Gram: rate22KPerGram * 8,
      rate18KPerGram,
      rate18KPer8Gram: rate18KPerGram * 8,
      silverPerGram,
      silverPer8Gram: silverPerGram * 8,
      source: RateSource.MARKET,
      isMarketHoliday: false,
      verifiedAt: new Date(),
    });

    if (goldRateResult.isFailure) {
      throw new AppError(goldRateResult.getError(), 400, "INVALID_RATE_DATA");
    }

    const goldRate = goldRateResult.getValue()!;
    const saveResult = await this.goldRateRepository.save(goldRate);

    if (saveResult.isFailure) {
      throw new AppError("Failed to store fetched rate in database", 500, "DB_ERROR");
    }

    this.logger.info("Manual live rate fetch and storage completed successfully");

    return {
      date: goldRate.getDate(),
      rate22KPerGram: goldRate.getRate22KPerGram(),
      rate22KPer8Gram: goldRate.getRate22KPer8Gram(),
      rate18KPerGram: goldRate.getRate18KPerGram(),
      rate18KPer8Gram: goldRate.getRate18KPer8Gram(),
      silverPerGram: goldRate.getSilverPerGram(),
      silverPer8Gram: goldRate.getSilverPer8Gram(),
      source: goldRate.getSource(),
      isMarketHoliday: goldRate.getIsMarketHoliday(),
      verifiedAt: goldRate.getVerifiedAt(),
      createdAt: goldRate.getCreatedAt(),
    };
  }
}
