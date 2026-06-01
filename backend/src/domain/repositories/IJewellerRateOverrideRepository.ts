import { JewellerRateOverride } from "@domain/entities/JewellerRateOverride.entity";
import { Result } from "@domain/shared/Result";
import { IRead, IWrite } from "./base/base.Repo";

export interface IJewellerRateOverrideRepository extends IRead<JewellerRateOverride, any>, IWrite<JewellerRateOverride> {
  findByShopAndDate(shopId: string, date: Date): Promise<Result<JewellerRateOverride | null>>;
  save(override: JewellerRateOverride): Promise<Result<JewellerRateOverride>>;
}
