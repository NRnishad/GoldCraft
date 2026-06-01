import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { IShopRepository } from "@domain/repositories/IShopRepository";
import { IS3Service } from "@application/interfaces/IS3Service";
import { AppError } from "@application/errors/AppError";

interface CreateUploadUrlInput {
  ownerUserId: string;
  fileName: string;
  contentType: string;
}

@injectable()
export class CreateProfilePhotoUploadUrlUseCase {
  constructor(
    @inject(TYPES.IShopRepository)
    private readonly shopRepository: IShopRepository,
    @inject(TYPES.IS3Service)
    private readonly s3Service: IS3Service,
  ) {}

  public async execute(input: CreateUploadUrlInput) {
    const shopResult = await this.shopRepository.findByOwnerUserId(input.ownerUserId);
    if (shopResult.isFailure || !shopResult.getValue()) {
      throw new AppError("Shop profile not found", 404, "SHOP_NOT_FOUND");
    }

    const s3Result = await this.s3Service.createProfilePhotoUploadUrl({
      ownerUserId: input.ownerUserId,
      fileName: input.fileName,
      contentType: input.contentType,
    });

    return s3Result;
  }
}
