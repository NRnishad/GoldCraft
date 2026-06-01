import { Shop } from "@entities/Shop";

export interface IGetOnboardingStateShopRepository {
  findByOwnerUserId(ownerUserId: string): Promise<Shop | null>;
}