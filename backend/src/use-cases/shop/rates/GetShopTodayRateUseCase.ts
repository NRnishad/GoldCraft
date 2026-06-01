import { ILogger } from '../../ports/ILogger';
import { GoldRateModel } from '../../../frameworks-and-drivers/database/models/GoldRateModel';
import { JewellerRateOverrideModel } from '../../../frameworks-and-drivers/database/models/JewellerRateOverrideModel';
import { ShopModel } from '../../../frameworks-and-drivers/database/models/ShopModel';
import { AppError } from '../../../interface-adapters/utils/AppError';

export interface IEffectiveShopRate {
  date: Date;
  rate22KPerGram: number;
  rate22KPer8Gram: number;
  rate18KPerGram: number;
  rate18KPer8Gram: number;
  silverPerGram: number;
  silverPer8Gram: number;
  isOverridden: boolean;
}

export class GetShopTodayRateUseCase {
  constructor(private logger: ILogger) {}

  public async execute(userId: string): Promise<IEffectiveShopRate> {
    this.logger.info(`Fetching effective today's rate for Jeweller (User ID: ${userId})`);

  
    const shop = await ShopModel.findOne({ ownerUserId: userId }).lean();
    if (!shop) {
      this.logger.error(`Shop query failed for User ID: ${userId}`);
      throw new AppError(404, "Your Shop profile was not found. Have you completed onboarding?");
    }

    
    const globalRate = await GoldRateModel.findOne().sort({ date: -1, createdAt: -1 }).lean();
    if (!globalRate) {
      throw new AppError(404, "No market rates have been published yet by the Admin.");
    }

   
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

   
    const override = await JewellerRateOverrideModel.findOne({ 
      shopId: shop._id, 
      date: today 
    }).lean();

    
    const rate22KPerGram = override?.rate22KPerGram || globalRate.rate22KPerGram;
    const rate18KPerGram = override?.rate18KPerGram || globalRate.rate18KPerGram;
    const silverPerGram = override?.silverPerGram || globalRate.silverPerGram;

    return {
      date: globalRate.date,
      rate22KPerGram,
      rate22KPer8Gram: rate22KPerGram * 8, 
      rate18KPerGram,
      rate18KPer8Gram: rate18KPerGram * 8,
      silverPerGram,
      silverPer8Gram: silverPerGram * 8,
      isOverridden: !!override
    };
  }
}