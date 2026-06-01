import cron from 'node-cron';
import { env } from '../config/env';
import { ILogger } from '../../use-cases/ports/ILogger';
import { MetalRatesApiService } from '../external-services/MetalRatesApiService';
import { GoldRateModel } from '../database/models/GoldRateModel';

export class RateScheduler {
  private apiService: MetalRatesApiService;

  constructor(private logger: ILogger) {
    this.apiService = new MetalRatesApiService(this.logger);
  }

  
  public initialize(): void {
    cron.schedule(env.CRON_RATE_FETCH_SCHEDULE || '0 10 * * *', async () => {
      await this.fetchAndStoreDailyRates();
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });
    
    this.logger.info(`RateScheduler initialized with cron pattern: ${env.CRON_RATE_FETCH_SCHEDULE || '0 9 * * *'}`);
  }

  private async fetchAndStoreDailyRates(): Promise<void> {
    try {
      this.logger.info('Executing scheduled daily rate fetch');
      
      const apiResult = await this.apiService.fetchTodayRates();
      const rates = apiResult.data;

      if (!rates) {
         this.logger.error('No data received from API during scheduled fetch');
         return;
      }

    
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const rate22KPerGram = rates.gold['22k'];
      const rate18KPerGram = rates.gold['18k'];
      const silverPerGram = rates.silver['999'];

      // Perform business calculations for 8 Grams (Pavan)
      await GoldRateModel.findOneAndUpdate(
        { date: today },
        {
          date: today,
          rate22KPerGram,
          rate22KPer8Gram: rate22KPerGram * 8,
          rate18KPerGram,
          rate18KPer8Gram: rate18KPerGram * 8,
          silverPerGram,
          silverPer8Gram: silverPerGram * 8,
          source: 'market',
          isMarketHoliday: false,
          verifiedAt: new Date(),
          createdAt: new Date()
        },
        { upsert: true, new: true }
      );

      this.logger.info('Successfully fetched, calculated, and stored daily gold rates via cron job.');
    } catch (error: any) {
      this.logger.error(`Failed scheduled rate fetch in Cron Job: ${error.message}`);
    }
  }
}