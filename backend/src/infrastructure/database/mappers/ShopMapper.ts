import { injectable } from "inversify";
import { Shop } from "@domain/entities/Shop.entity";
import { Phone } from "@domain/value-objects/Phone.vo";
import { Result } from "@domain/shared/Result";
import { IDbMapper } from "@domain/mappers/IDbMapper";
import { IShopDocument } from "../models/ShopModel";

@injectable()
export class ShopMapper implements IDbMapper<Shop, IShopDocument> {
  public toDomain(doc: IShopDocument): Result<Shop> {
    const phoneResult = Phone.create(doc.phone);
    if (phoneResult.isFailure) {
      return Result.fail<Shop>(phoneResult.getError());
    }

    return Shop.create({
      id: String(doc._id),
      ownerUserId: String(doc.ownerUserId),
      shopName: doc.shopName,
      phone: phoneResult.getValue(),
      city: doc.city,
      address: doc.address,
      tagline: doc.tagline,
      onboardingComplete: doc.onboardingComplete,
      onboardingStep: doc.onboardingStep,
      profilePhotoKey: doc.profilePhotoKey,
      profilePhotoUrl: doc.profilePhotoUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public toPersistence(entity: Shop): any {
    return {
      _id: entity.getId(),
      ownerUserId: entity.getOwnerUserId(),
      shopName: entity.getShopName(),
      phone: entity.getPhone().getValue(),
      city: entity.getCity(),
      address: entity.getAddress(),
      tagline: entity.getTagline(),
      onboardingComplete: entity.getOnboardingComplete(),
      onboardingStep: entity.getOnboardingStep(),
      profilePhotoKey: entity.getProfilePhotoKey(),
      profilePhotoUrl: entity.getProfilePhotoUrl(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
