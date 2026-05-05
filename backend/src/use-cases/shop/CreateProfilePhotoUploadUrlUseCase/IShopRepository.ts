import { Shop } from "@entities/Shop";

export interface ICreateProfilePhotoUploadUrlShopRepository {
  findByOwnerUserId(ownerUserId: string): Promise<Shop | null>;
}