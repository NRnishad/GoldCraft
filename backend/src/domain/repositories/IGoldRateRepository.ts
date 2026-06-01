import { GoldRate } from "@domain/entities/GoldRate.entity";
import { Result } from "@domain/shared/Result";
import { IRead, IWrite } from "./base/base.Repo";

export interface IGoldRateRepository extends IRead<GoldRate, any>, IWrite<GoldRate> {
  findByDate(date: Date): Promise<Result<GoldRate | null>>;
  findLatest(): Promise<Result<GoldRate | null>>;
  findHistory(cutoffDate: Date): Promise<Result<GoldRate[]>>;
  save(goldRate: GoldRate): Promise<Result<GoldRate>>;
}
