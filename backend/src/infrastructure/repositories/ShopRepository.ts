import { injectable, inject } from "inversify";
import { BaseRepository } from "./base/BaseRepository";
import { Shop } from "@domain/entities/Shop.entity";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { Result } from "@domain/shared/Result";
import { ShopModel, IShopDocument } from "../database/models/ShopModel";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { TYPES } from "@di/types.di";

@injectable()
export class ShopRepository
  extends BaseRepository<Shop, IShopDocument, any>
  implements IShopRepository
{
  constructor(
    @inject(TYPES.ShopMapper)
    readonly mapper: IDbMapper<Shop, IShopDocument>,
  ) {
    super(ShopModel, mapper);
  }

  public async findByOwnerUserId(ownerUserId: string): Promise<Result<Shop | null>> {
    try {
      const doc = await ShopModel.findOne({
        ownerUserId: ownerUserId,
      }).exec();
      if (!doc) {
        return Result.ok<null>(null);
      }
      const domainResult = this.mapper.toDomain(doc);
      if (domainResult.isFailure) {
        return Result.fail<Shop | null>(domainResult.getError());
      }
      return Result.ok<Shop | null>(domainResult.getValue());
    } catch (err: any) {
      return Result.fail<Shop | null>(`Failed to find shop by owner user ID: ${err.message}`);
    }
  }

  public async save(shop: Shop): Promise<Result<Shop>> {
    try {
      const persistence = this.mapper.toPersistence(shop);
      const docId = persistence._id;
      delete persistence._id;

      const doc = await ShopModel.findByIdAndUpdate(
        docId,
        { $set: persistence },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).exec();

      return this.mapper.toDomain(doc);
    } catch (err: any) {
      return Result.fail<Shop>(`Failed to save shop: ${err.message}`);
    }
  }
}
