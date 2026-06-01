import { injectable } from "inversify";
import { GoldRate, RateSource } from "@domain/entities/GoldRate.entity";
import { Result } from "@domain/shared/Result";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { GoldRateDocument } from "../models/GoldRateModel";

@injectable()
export class GoldRateMapper implements IDbMapper<GoldRate, GoldRateDocument> {
  public toDomain(doc: GoldRateDocument): Result<GoldRate> {
    return GoldRate.create({
      date: doc.date,
      rate22KPerGram: doc.rate22KPerGram,
      rate22KPer8Gram: doc.rate22KPer8Gram,
      rate18KPerGram: doc.rate18KPerGram,
      rate18KPer8Gram: doc.rate18KPer8Gram,
      silverPerGram: doc.silverPerGram,
      silverPer8Gram: doc.silverPer8Gram,
      source: doc.source as RateSource,
      isMarketHoliday: doc.isMarketHoliday,
      verifiedAt: doc.verifiedAt,
      createdAt: doc.createdAt,
    });
  }

  public toPersistence(entity: GoldRate): any {
    return {
      date: entity.getDate(),
      rate22KPerGram: entity.getRate22KPerGram(),
      rate22KPer8Gram: entity.getRate22KPer8Gram(),
      rate18KPerGram: entity.getRate18KPerGram(),
      rate18KPer8Gram: entity.getRate18KPer8Gram(),
      silverPerGram: entity.getSilverPerGram(),
      silverPer8Gram: entity.getSilverPer8Gram(),
      source: entity.getSource(),
      isMarketHoliday: entity.getIsMarketHoliday(),
      verifiedAt: entity.getVerifiedAt(),
      createdAt: entity.getCreatedAt(),
    };
  }
}
