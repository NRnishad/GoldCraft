import { ILogger } from '../../ports/ILogger';
import { MetalRatesApiService } from '../../../frameworks-and-drivers/external-services/MetalRatesApiService';
import { GoldRateModel } from '../../../frameworks-and-drivers/database/models/GoldRateModel';
import { IGoldRate } from '../../../entities/GoldRate';
import { AppError } from '../../../interface-adapters/utils/AppError';

export class TriggerManualRateFetchUseCase {
  constructor(
    private apiService: MetalRatesApiService, 
    private logger: ILogger
  ) {}

  public async execute(): Promise<IGoldRate> {
    this.logger.info('Admin manually triggering live metal rates fetch');

    // 1. Fetch from external provider (will throw 429 AppError if limit is reached)
    const apiResult = await this.apiService.fetchTodayRates();
    const rates = apiResult.data;

    if (!rates) {
      throw new AppError('No data received from API during manual fetch', 500, 'API_ERROR');
    }

    // 2. Normalize date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Extract raw values
    const rate22KPerGram = rates.gold['22k'];
    const rate18KPerGram = rates.gold['18k'];
    const silverPerGram = rates.silver['999'];

    // 4. Calculate 8g variants and save to Database
    const updatedRate = await GoldRateModel.findOneAndUpdate(
      { date: today },
      {
        $set: {
          rate22KPerGram,
          rate22KPer8Gram: rate22KPerGram * 8,
          rate18KPerGram,
          rate18KPer8Gram: rate18KPerGram * 8,
          silverPerGram,
          silverPer8Gram: silverPerGram * 8,
          source: 'market',
          isMarketHoliday: false,
          verifiedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { new: true, upsert: true }
    ).lean();

    if (!updatedRate) {
      throw new AppError('Failed to store fetched rate into database', 500, 'DB_ERROR');
    }

    this.logger.info('Manual rate fetch and database update successful.');
    return updatedRate as unknown as IGoldRate;
  }
}