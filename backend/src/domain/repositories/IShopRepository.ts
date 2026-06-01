import { Shop } from "@domain/entities/Shop.entity";
import { Result } from "@domain/shared/Result";
import { IRead, IWrite } from "./base/base.Repo";

export interface IShopRepository extends IRead<Shop, any>, IWrite<Shop> {
  findByOwnerUserId(ownerUserId: string): Promise<Result<Shop | null>>;
  save(shop: Shop): Promise<Result<Shop>>;
}
