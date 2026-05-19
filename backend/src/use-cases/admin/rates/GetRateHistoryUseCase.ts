import { ILogger } from '../../ports/ILogger';
import { GoldRateModel } from '../../../frameworks-and-drivers/database/models/GoldRateModel';
import { IGoldRate } from '../../../entities/GoldRate';

export class GetRateHistoryUseCase {
  constructor(private logger: ILogger) {}

  public async execute(daysLimit: number = 30): Promise<IGoldRate[]> {
    this.logger.info(`Admin fetching rate history for the last ${daysLimit} days`);
    
    const cutoffDate = new Date();
    cutoffDate.setUTCHours(0, 0, 0, 0);
    cutoffDate.setDate(cutoffDate.getDate() - daysLimit);

    const rates = await GoldRateModel.find({ date: { $gte: cutoffDate } })
      .sort({ date: -1 })
      .lean();

    return rates as unknown as IGoldRate[];
  }
}