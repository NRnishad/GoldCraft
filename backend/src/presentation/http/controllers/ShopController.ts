import { Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { SaveOnboardingUseCase } from "@application/usecases/shop/SaveOnboardingUseCase";
import { GetOnboardingStateUseCase } from "@application/usecases/shop/GetOnboardingStateUseCase";
import { GetShopProfileUseCase } from "@application/usecases/shop/GetShopProfileUseCase";
import { UpdateShopProfileUseCase } from "@application/usecases/shop/UpdateShopProfileUseCase";
import { CreateProfilePhotoUploadUrlUseCase } from "@application/usecases/shop/CreateProfilePhotoUploadUrlUseCase";
import { UpdateShopProfilePhotoUseCase } from "@application/usecases/shop/UpdateShopProfilePhotoUseCase";

import {
  onboardingSchema,
  profilePhotoUploadUrlSchema,
  updateProfilePhotoSchema,
  updateShopProfileSchema,
} from "../validators/shop.validator";
import { sendSuccess } from "../helpers/response";
import { AppError } from "@application/errors/AppError";
import { AuthRequest } from "../middlewares/AuthenticateMiddleware";

@injectable()
export class ShopController {
  constructor(
    @inject(TYPES.SaveOnboardingUseCase)
    private readonly saveOnboardingUseCase: SaveOnboardingUseCase,
    @inject(TYPES.GetOnboardingStateUseCase)
    private readonly getOnboardingStateUseCase: GetOnboardingStateUseCase,
    @inject(TYPES.GetShopProfileUseCase)
    private readonly getShopProfileUseCase: GetShopProfileUseCase,
    @inject(TYPES.UpdateShopProfileUseCase)
    private readonly updateShopProfileUseCase: UpdateShopProfileUseCase,
    @inject(TYPES.CreateProfilePhotoUploadUrlUseCase)
    private readonly createProfilePhotoUploadUrlUseCase: CreateProfilePhotoUploadUrlUseCase,
    @inject(TYPES.UpdateShopProfilePhotoUseCase)
    private readonly updateShopProfilePhotoUseCase: UpdateShopProfilePhotoUseCase,
  ) {}

  private ensureJeweller(req: AuthRequest): string {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    if (req.user.role !== "jeweller") {
      throw new AppError(
        "Only jewellers can access shop features",
        403,
        "ONLY_JEWELLER_ALLOWED",
      );
    }

    return req.user.userId;
  }

  public getOnboardingState = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerUserId = this.ensureJeweller(req);
      const result = await this.getOnboardingStateUseCase.execute({
        ownerUserId,
      });

      sendSuccess(res, "Onboarding state fetched", result);
    } catch (error) {
      next(error);
    }
  };

  public saveOnboarding = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerUserId = this.ensureJeweller(req);
      const input = onboardingSchema.parse(req.body);
      const result = await this.saveOnboardingUseCase.execute({
        ownerUserId,
        ...input,
      });

      sendSuccess(res, "Onboarding completed", result);
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerUserId = this.ensureJeweller(req);
      const result = await this.getShopProfileUseCase.execute({
        ownerUserId,
      });

      sendSuccess(res, "Shop profile fetched", result);
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerUserId = this.ensureJeweller(req);
      const input = updateShopProfileSchema.parse(req.body);
      const result = await this.updateShopProfileUseCase.execute({
        ownerUserId,
        ...input,
      });

      sendSuccess(res, "Shop profile updated", result);
    } catch (error) {
      next(error);
    }
  };

  public createProfilePhotoUploadUrl = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerUserId = this.ensureJeweller(req);
      const input = profilePhotoUploadUrlSchema.parse(req.body);
      const result = await this.createProfilePhotoUploadUrlUseCase.execute({
        ownerUserId,
        ...input,
      });

      sendSuccess(res, "Profile photo upload URL created", result);
    } catch (error) {
      next(error);
    }
  };

  public updateProfilePhoto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerUserId = this.ensureJeweller(req);
      const input = updateProfilePhotoSchema.parse(req.body);
      const result = await this.updateShopProfilePhotoUseCase.execute({
        ownerUserId,
        ...input,
      });

      sendSuccess(res, "Profile photo updated", result);
    } catch (error) {
      next(error);
    }
  };
}
