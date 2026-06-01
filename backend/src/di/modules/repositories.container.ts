import { ContainerModule } from "inversify";
import { TYPES } from "../types.di";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { ShopRepository } from "@infrastructure/repositories/ShopRepository";
import { IGoldRateRepository } from "@domain/repositories/IGoldRateRepository";
import { GoldRateRepository } from "@infrastructure/repositories/GoldRateRepository";
import { IJewellerRateOverrideRepository } from "@domain/repositories/IJewellerRateOverrideRepository";
import { JewellerRateOverrideRepository } from "@infrastructure/repositories/JewellerRateOverrideRepository";

export const repositoriesContainer = new ContainerModule((options) => {
  options.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
  options.bind<IShopRepository>(TYPES.IShopRepository).to(ShopRepository).inSingletonScope();
  options.bind<IGoldRateRepository>(TYPES.IGoldRateRepository).to(GoldRateRepository).inSingletonScope();
  options.bind<IJewellerRateOverrideRepository>(TYPES.IJewellerRateOverrideRepository).to(JewellerRateOverrideRepository).inSingletonScope();
});
