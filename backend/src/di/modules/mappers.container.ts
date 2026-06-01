import { ContainerModule } from "inversify";
import { TYPES } from "../types.di";
import { UserMapper } from "@infrastructure/database/mappers/UserMapper";
import { ShopMapper } from "@infrastructure/database/mappers/ShopMapper";
import { GoldRateMapper } from "@infrastructure/database/mappers/GoldRateMapper";
import { JewellerRateOverrideMapper } from "@infrastructure/database/mappers/JewellerRateOverrideMapper";
import { IDbMapper } from "@domain/mappers/IDbMapper";

export const mappersContainer = new ContainerModule((options) => {
  options.bind<IDbMapper<any, any>>(TYPES.UserMapper).to(UserMapper).inSingletonScope();
  options.bind<IDbMapper<any, any>>(TYPES.ShopMapper).to(ShopMapper).inSingletonScope();
  options.bind<IDbMapper<any, any>>(TYPES.GoldRateMapper).to(GoldRateMapper).inSingletonScope();
  options.bind<IDbMapper<any, any>>(TYPES.JewellerRateOverrideMapper).to(JewellerRateOverrideMapper).inSingletonScope();
});
