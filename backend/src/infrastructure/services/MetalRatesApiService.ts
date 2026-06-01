import axios from "axios";
import { injectable, inject } from "inversify";
import { IMetalRatesApiService, IMetalRatesResponse } from "@application/interfaces/IMetalRatesApiService";
import { ILogger } from "@application/interfaces/ILogger";
import { TYPES } from "@di/types.di";
import { env } from "@config/env";
import { AppError } from "@application/errors/AppError";

@injectable()
export class MetalRatesApiService implements IMetalRatesApiService {
  constructor(
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {}

  public async fetchTodayRates(): Promise<IMetalRatesResponse> {
    try {
      this.logger.info("Fetching live metal rates from external JustGoldRates API");

      const response = await axios.get<IMetalRatesResponse>(env.CLIENT_RATES_API_URL, {
        headers: {
          Authorization: `Bearer ${env.CLIENT_RATES_API_TOKEN}`,
        },
        timeout: 10000,
      });

      if (!response.data.success || !response.data.data) {
        throw new AppError("External API returned failure status or missing data", 500, "API_ERROR");
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        this.logger.warn("Rate limit exceeded for JustGoldRates API (1 request/hour limit reached)");
        throw new AppError("Rate limit exceeded for metal rates API", 429, "RATE_LIMIT_EXCEEDED");
      }
      this.logger.error(`Error fetching metal rates: ${error.message}`);
      throw new AppError("Failed to fetch rates from external provider", 500, "API_ERROR");
    }
  }
}
