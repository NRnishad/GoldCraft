import axios from 'axios';
import { env } from '../config/env';
import { ILogger } from '../../use-cases/ports/ILogger';
import { AppError } from '../../interface-adapters/utils/AppError';

export interface IMetalRatesResponse {
  success: boolean;
  data?: {
    date: string;
    currency: string;
    unit: string;
    gold: {
      '22k': number;
      '18k': number;
    };
    silver: {
      '999': number;
    };
    updatedAt: string;
  };
  error?: string;
}

export class MetalRatesApiService {
  constructor(private logger: ILogger) {}

  public async fetchTodayRates(): Promise<IMetalRatesResponse> {
    try {
      this.logger.info('Fetching live metal rates from external JustGoldRates API');
      
      const response = await axios.get<IMetalRatesResponse>(env.CLIENT_RATES_API_URL, {
        headers: {
          Authorization: `Bearer ${env.CLIENT_RATES_API_TOKEN}`
        },
        timeout: 10000 
      });

      if (!response.data.success || !response.data.data) {
        throw new AppError(500, 'External API returned failure status or missing data');
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        this.logger.warn('Rate limit exceeded for JustGoldRates API (1 request/hour limit reached)');
        throw new AppError(429, 'Rate limit exceeded for metal rates API');
      }
      this.logger.error(`Error fetching metal rates: ${error.message}`);
      throw new AppError(500, 'Failed to fetch rates from external provider');
    }
  }
}