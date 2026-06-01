import { injectable } from "inversify";
import { JewellerRateOverride } from "@domain/entities/JewellerRateOverride.entity";
import { Result } from "@domain/shared/Result";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { JewellerRateOverrideDocument } from "../models/JewellerRateOverrideModel";

@injectable()
export class JewellerRateOverrideMapper
  implements IDbMapper<JewellerRateOverride, JewellerRateOverrideDocument>
{
  public toDomain(doc: JewellerRateOverrideDocument): Result<JewellerRateOverride> {
    return JewellerRateOverride.create({
      shopId: String(doc.shopId),
      date: doc.date,
      rate22KPerGram: doc.rate22KPerGram,
      rate18KPerGram: doc.rate18KPerGram,
      silverPerGram: doc.silverPerGram,
      createdByUserId: String(doc.createdByUserId),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public toPersistence(entity: JewellerRateOverride): any {
    return {
      shopId: entity.getShopId(),
      date: entity.getDate(),
      rate22KPerGram: entity.getRate22KPerGram(),
      rate18KPerGram: entity.getRate18KPerGram(),
      silverPerGram: entity.getSilverPerGram(),
      createdByUserId: entity.getCreatedByUserId(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
