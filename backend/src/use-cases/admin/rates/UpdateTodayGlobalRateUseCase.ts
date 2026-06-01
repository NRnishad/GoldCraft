import { ILogger } from '../../ports/ILogger';
import { GoldRateModel } from '../../../frameworks-and-drivers/database/models/GoldRateModel';
import { IGoldRate } from '../../../entities/GoldRate';
import { AppError } from '../../../interface-adapters/utils/AppError';

export interface IUpdateRateInput {
  rate22KPerGram: number;
  rate18KPerGram: number;
  silverPerGram: number;
  isMarketHoliday?: boolean;
}

export class UpdateTodayGlobalRateUseCase {
  constructor(private logger: ILogger) {}

  public async execute(input: IUpdateRateInput): Promise<IGoldRate> {
    this.logger.info('Admin manually updating today\'s global metal rates');

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); 

    const rate22KPer8Gram = input.rate22KPerGram * 8;
    const rate18KPer8Gram = input.rate18KPerGram * 8;
    const silverPer8Gram = input.silverPerGram * 8;

    const updatedRate = await GoldRateModel.findOneAndUpdate(
      { date: today },
      {
        $set: {
          rate22KPerGram: input.rate22KPerGram,
          rate22KPer8Gram,
          rate18KPerGram: input.rate18KPerGram,
          rate18KPer8Gram,
          silverPerGram: input.silverPerGram,
          silverPer8Gram,
          source: 'admin', 
          isMarketHoliday: input.isMarketHoliday || false,
          verifiedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { new: true, upsert: true }
    ).lean();

    if (!updatedRate) {
      throw new AppError(500, 'Failed to update or insert today\'s global rate');
    }

    return updatedRate as unknown as IGoldRate;
  }
}