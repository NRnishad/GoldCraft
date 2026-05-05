import { ICreateProfilePhotoUploadUrlShopRepository } from "./IShopRepository";
import { ICreateProfilePhotoUploadUrlStorageService } from "./IStorageService";

export interface CreateProfilePhotoUploadUrlInput {
  ownerUserId: string;
  fileName: string;
  contentType: string;
}

export interface CreateProfilePhotoUploadUrlOutput {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}

const allowedContentTypes = ["image/jpeg", "image/png", "image/webp"];

export class CreateProfilePhotoUploadUrlUseCase {
  constructor(
    private readonly shopRepository: ICreateProfilePhotoUploadUrlShopRepository,
    private readonly storageService: ICreateProfilePhotoUploadUrlStorageService,
  ) {}

  async execute(
    input: CreateProfilePhotoUploadUrlInput,
  ): Promise<CreateProfilePhotoUploadUrlOutput> {
    const shop = await this.shopRepository.findByOwnerUserId(input.ownerUserId);

    if (!shop) {
      throw new Error("SHOP_NOT_FOUND");
    }

    if (!allowedContentTypes.includes(input.contentType)) {
      throw new Error("UNSUPPORTED_FILE_TYPE");
    }

    if (!input.fileName.trim()) {
      throw new Error("FILE_NAME_REQUIRED");
    }

    return this.storageService.createProfilePhotoUploadUrl({
      ownerUserId: input.ownerUserId,
      fileName: input.fileName,
      contentType: input.contentType,
    });
  }
}