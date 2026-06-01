import { injectable, inject } from "inversify";
import { BaseRepository } from "./base/BaseRepository";
import { GoldRate } from "@domain/entities/GoldRate.entity";
import { IGoldRateRepository } from "@domain/repositories/IGoldRateRepository";
import { Result } from "@domain/shared/Result";
import { GoldRateModel, GoldRateDocument } from "../database/models/GoldRateModel";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { TYPES } from "@di/types.di";

@injectable()
export class GoldRateRepository
  extends BaseRepository<GoldRate, GoldRateDocument, any>
  implements IGoldRateRepository
{
  constructor(
    @inject(TYPES.GoldRateMapper)
    readonly mapper: IDbMapper<GoldRate, GoldRateDocument>,
  ) {
    super(GoldRateModel, mapper);
  }

  public async findByDate(date: Date): Promise<Result<GoldRate | null>> {
    try {
      const doc = await GoldRateModel.findOne({ date }).exec();
      if (!doc) {
        return Result.ok<null>(null);
      }
      const domainResult = this.mapper.toDomain(doc);
      if (domainResult.isFailure) {
        return Result.fail<GoldRate | null>(domainResult.getError());
      }
      return Result.ok<GoldRate | null>(domainResult.getValue());
    } catch (err: any) {
      return Result.fail<GoldRate | null>(`Failed to find rate by date: ${err.message}`);
    }
  }

  public async findLatest(): Promise<Result<GoldRate | null>> {
    try {
      const doc = await GoldRateModel.findOne().sort({ date: -1, createdAt: -1 }).exec();
      if (!doc) {
        return Result.ok<null>(null);
      }
      const domainResult = this.mapper.toDomain(doc);
      if (domainResult.isFailure) {
        return Result.fail<GoldRate | null>(domainResult.getError());
      }
      return Result.ok<GoldRate | null>(domainResult.getValue());
    } catch (err: any) {
      return Result.fail<GoldRate | null>(`Failed to find latest rate: ${err.message}`);
    }
  }

  public async findHistory(cutoffDate: Date): Promise<Result<GoldRate[]>> {
    try {
      const docs = await GoldRateModel.find({ date: { $gte: cutoffDate } })
        .sort({ date: -1 })
        .exec();

      const entities: GoldRate[] = [];
      for (const doc of docs) {
        const domainResult = this.mapper.toDomain(doc);
        if (domainResult.isFailure) {
          return Result.fail<GoldRate[]>(domainResult.getError());
        }
        entities.push(domainResult.getValue());
      }
      return Result.ok(entities);
    } catch (err: any) {
      return Result.fail<GoldRate[]>(`Failed to query rate history: ${err.message}`);
    }
  }

  public async save(goldRate: GoldRate): Promise<Result<GoldRate>> {
    try {
      const persistence = this.mapper.toPersistence(goldRate);

      const doc = await GoldRateModel.findOneAndUpdate(
        { date: goldRate.getDate() },
        { $set: persistence },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).exec();

      return this.mapper.toDomain(doc);
    } catch (err: any) {
      return Result.fail<GoldRate>(`Failed to save rate: ${err.message}`);
    }
  }
}
