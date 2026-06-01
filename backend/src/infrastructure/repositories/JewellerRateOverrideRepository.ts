import { injectable, inject } from "inversify";
import { BaseRepository } from "./base/BaseRepository";
import { JewellerRateOverride } from "@domain/entities/JewellerRateOverride.entity";
import { IJewellerRateOverrideRepository } from "@domain/repositories/IJewellerRateOverrideRepository";
import { Result } from "@domain/shared/Result";
import { JewellerRateOverrideModel, JewellerRateOverrideDocument } from "../database/models/JewellerRateOverrideModel";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { TYPES } from "@di/types.di";

@injectable()
export class JewellerRateOverrideRepository
  extends BaseRepository<JewellerRateOverride, JewellerRateOverrideDocument, any>
  implements IJewellerRateOverrideRepository
{
  constructor(
    @inject(TYPES.JewellerRateOverrideMapper)
    readonly mapper: IDbMapper<JewellerRateOverride, JewellerRateOverrideDocument>,
  ) {
    super(JewellerRateOverrideModel, mapper);
  }

  public async findByShopAndDate(shopId: string, date: Date): Promise<Result<JewellerRateOverride | null>> {
    try {
      const doc = await JewellerRateOverrideModel.findOne({
        shopId: shopId,
        date,
      }).exec();
      if (!doc) {
        return Result.ok<null>(null);
      }
      const domainResult = this.mapper.toDomain(doc);
      if (domainResult.isFailure) {
        return Result.fail<JewellerRateOverride | null>(domainResult.getError());
      }
      return Result.ok<JewellerRateOverride | null>(domainResult.getValue());
    } catch (err: any) {
      return Result.fail<JewellerRateOverride | null>(`Failed to find override: ${err.message}`);
    }
  }

  public async save(override: JewellerRateOverride): Promise<Result<JewellerRateOverride>> {
    try {
      const persistence = this.mapper.toPersistence(override);

      const doc = await JewellerRateOverrideModel.findOneAndUpdate(
        {
          shopId: override.getShopId(),
          date: override.getDate(),
        },
        { $set: persistence },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).exec();

      return this.mapper.toDomain(doc);
    } catch (err: any) {
      return Result.fail<JewellerRateOverride>(`Failed to save override: ${err.message}`);
    }
  }
}
