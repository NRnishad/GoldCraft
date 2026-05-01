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
    private readonly storageService: ICreateProfilePhotoUploadUrlStorageService,
  ) {}

  async execute(
    input: CreateProfilePhotoUploadUrlInput,
  ): Promise<CreateProfilePhotoUploadUrlOutput> {
    if (!allowedContentTypes.includes(input.contentType)) {
      throw new Error("UNSUPPORTED_FILE_TYPE");
    }

    return this.storageService.createProfilePhotoUploadUrl({
      ownerUserId: input.ownerUserId,
      fileName: input.fileName,
      contentType: input.contentType,
    });
  }
}