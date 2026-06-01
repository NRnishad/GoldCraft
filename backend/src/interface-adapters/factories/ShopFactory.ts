import { UpdateShopProfilePhotoUseCase } from './../../use-cases/shop/UpdateShopProfilePhotoUseCase/UpdateShopProfilePhotoUseCase';
import { MongoShopRepository } from "@drivers/database/repositories/MongoShopRepository";
import { GetOnboardingStateUseCase } from "@use-cases/shop/GetOnboardingStateUseCase/GetOnboardingStateUseCase";
import { SaveOnboardingUseCase } from "@use-cases/shop/SaveOnboardingUseCase/SaveOnboardingUseCase";
import { GetShopProfileUseCase } from "@use-cases/shop/GetShopProfileUseCase/GetShopProfileUseCase";
import { UpdateShopProfileUseCase } from "@use-cases/shop/UpdateShopProfileUseCase/UpdateShopProfileUseCase";
import { S3StorageService } from "@drivers/storage/S3StorageService";
import { CreateProfilePhotoUploadUrlUseCase } from "@use-cases/shop/CreateProfilePhotoUploadUrlUseCase/CreateProfilePhotoUploadUrlUseCase";
import { UpdateShopProfilePhotoUseCase } from "../../use-cases/shop/UpdateShopProfilePhotoUseCase/UpdateShopProfilePhotoUseCase";
export function makeGetOnboardingStateUseCase() {
  const shopRepository = new MongoShopRepository();

  return new GetOnboardingStateUseCase(shopRepository);
}

export function makeSaveOnboardingUseCase() {
  const shopRepository = new MongoShopRepository();

  return new SaveOnboardingUseCase(shopRepository);
}

export function makeGetShopProfileUseCase() {
  const shopRepository = new MongoShopRepository();

  return new GetShopProfileUseCase(shopRepository);
}

export function makeUpdateShopProfileUseCase() {
  const shopRepository = new MongoShopRepository();

  return new UpdateShopProfileUseCase(shopRepository);
}

export function makeCreateProfilePhotoUploadUrlUseCase() {
  const shopRepository = new MongoShopRepository();
  const storageService = new S3StorageService();

  return new CreateProfilePhotoUploadUrlUseCase(
    shopRepository,
    storageService,
  );
}

export function makeUpdateShopProfilePhotoUseCase() {
  const shopRepository = new MongoShopRepository();

  return new UpdateShopProfilePhotoUseCase(shopRepository);
}