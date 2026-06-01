import { Shop } from "@entities/Shop";

export interface IGetShopProfileRepository {
  findByOwnerUserId(ownerUserId: string): Promise<Shop | null>;
}