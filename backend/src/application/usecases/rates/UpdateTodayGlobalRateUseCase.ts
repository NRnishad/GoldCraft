import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IGoldRateRepository } from "@domain/repositories/IGoldRateRepository";
import { ILogger } from "@application/interfaces/ILogger";
import { GoldRate, RateSource } from "@domain/entities/GoldRate.entity";
import { AppError } from "@application/errors/AppError";

interface UpdateRateInput {
  rate22KPerGram: number;
  rate18KPerGram: number;
  silverPerGram: number;
  isMarketHoliday?: boolean;
}

@injectable()
export class UpdateTodayGlobalRateUseCase {
  constructor(
    @inject(TYPES.IGoldRateRepository)
    private readonly goldRateRepository: IGoldRateRepository,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public async execute(input: UpdateRateInput) {
    this.logger.info("Admin manually updating today's global rates");

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const goldRateResult = GoldRate.create({
      date: today,
      rate22KPerGram: input.rate22KPerGram,
      rate22KPer8Gram: input.rate22KPerGram * 8,
      rate18KPerGram: input.rate18KPerGram,
      rate18KPer8Gram: input.rate18KPerGram * 8,
      silverPerGram: input.silverPerGram,
      silverPer8Gram: input.silverPerGram * 8,
      source: RateSource.ADMIN,
      isMarketHoliday: input.isMarketHoliday || false,
      verifiedAt: new Date(),
    });

    if (goldRateResult.isFailure) {
      throw new AppError(goldRateResult.getError(), 400, "INVALID_RATE_DATA");
    }

    const goldRate = goldRateResult.getValue()!;
    const saveResult = await this.goldRateRepository.save(goldRate);

    if (saveResult.isFailure) {
      throw new AppError("Failed to update global rates in database", 500, "DB_ERROR");
    }

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
