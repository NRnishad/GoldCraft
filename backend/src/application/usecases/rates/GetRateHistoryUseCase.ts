import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IGoldRateRepository } from "@domain/repositories/IGoldRateRepository";
import { ILogger } from "@application/interfaces/ILogger";
import { AppError } from "@application/errors/AppError";

@injectable()
export class GetRateHistoryUseCase {
  constructor(
    @inject(TYPES.IGoldRateRepository)
    private readonly goldRateRepository: IGoldRateRepository,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public async execute(daysLimit: number = 30) {
    this.logger.info(`Fetching gold rates history for the last ${daysLimit} days`);

    const cutoffDate = new Date();
    cutoffDate.setUTCHours(0, 0, 0, 0);
    cutoffDate.setDate(cutoffDate.getDate() - daysLimit);

    const historyResult = await this.goldRateRepository.findHistory(cutoffDate);
    if (historyResult.isFailure) {
      throw new AppError("Failed to fetch rates history", 500, "DB_ERROR");
    }

    const rates = historyResult.getValue()!;
    return rates.map((rate) => ({
      date: rate.getDate(),
      rate22KPerGram: rate.getRate22KPerGram(),
      rate22KPer8Gram: rate.getRate22KPer8Gram(),
      rate18KPerGram: rate.getRate18KPerGram(),
      rate18KPer8Gram: rate.getRate18KPer8Gram(),
      silverPerGram: rate.getSilverPerGram(),
      silverPer8Gram: rate.getSilverPer8Gram(),
      source: rate.getSource(),
      isMarketHoliday: rate.getIsMarketHoliday(),
      verifiedAt: rate.getVerifiedAt(),
      createdAt: rate.getCreatedAt(),
    }));
  }
}
