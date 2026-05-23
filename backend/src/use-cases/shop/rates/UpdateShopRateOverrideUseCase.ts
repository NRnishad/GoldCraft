import { ILogger } from '../../ports/ILogger';
import { JewellerRateOverrideModel } from '../../../frameworks-and-drivers/database/models/JewellerRateOverrideModel';
import { ShopModel } from '../../../frameworks-and-drivers/database/models/ShopModel';
import { AppError } from '../../../interface-adapters/utils/AppError';

export interface IShopRateOverrideInput {
  userId: string;
  rate22KPerGram?: number;
  rate18KPerGram?: number;
  silverPerGram?: number;
}

export class UpdateShopRateOverrideUseCase {
  constructor(private logger: ILogger) {}

  public async execute(input: IShopRateOverrideInput): Promise<void> {
    this.logger.info(`Jeweller updating rate override for today (User ID: ${input.userId})`);

    
    const shop = await ShopModel.findOne({ ownerUserId: input.userId }).lean();
    if (!shop) {
      throw new AppError(404, 'Shop profile not found for this user');
    }

    const today = new Date();
   
    today.setUTCHours(0, 0, 0, 0);

   
    await JewellerRateOverrideModel.findOneAndUpdate(
      { shopId: shop._id, date: today },
      {
        $set: {
          rate22KPerGram: input.rate22KPerGram,
          rate18KPerGram: input.rate18KPerGram,
          silverPerGram: input.silverPerGram,
          createdByUserId: input.userId,
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true, new: true }
    );
  }
}