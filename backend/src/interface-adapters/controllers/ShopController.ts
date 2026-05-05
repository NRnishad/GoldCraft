import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  makeGetOnboardingStateUseCase,
  makeGetShopProfileUseCase,
  makeSaveOnboardingUseCase,
 makeCreateProfilePhotoUploadUrlUseCase,
makeUpdateShopProfilePhotoUseCase,
} from "../factories/ShopFactory";
import {
  onboardingSchema,
  profilePhotoUploadUrlSchema,
updateProfilePhotoSchema,
  updateShopProfileSchema,
} from "../validators/shopValidators";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";

function ensureJeweller(req: AuthRequest): string {
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

export const ShopController = {
  async getOnboardingState(req: AuthRequest, res: Response) {
    const ownerUserId = ensureJeweller(req);

    const useCase = makeGetOnboardingStateUseCase();

    const result = await useCase.execute({
      ownerUserId,
    });

    return sendSuccess(res, "Onboarding state fetched", result);
  },

  async saveOnboarding(req: AuthRequest, res: Response) {
    const ownerUserId = ensureJeweller(req);

    const input = onboardingSchema.parse(req.body);

    const useCase = makeSaveOnboardingUseCase();

    try {
      const result = await useCase.execute({
        ownerUserId,
        ...input,
      });

      return sendSuccess(res, "Onboarding completed", result);
    } catch (error) {
      if (error instanceof Error && error.message === "SHOP_SAVE_FAILED") {
        throw new AppError("Failed to save shop", 500, "SHOP_SAVE_FAILED");
      }

      throw error;
    }
  },

  async getProfile(req: AuthRequest, res: Response) {
    const ownerUserId = ensureJeweller(req);

    const useCase = makeGetShopProfileUseCase();

    try {
      const result = await useCase.execute({
        ownerUserId,
      });

      return sendSuccess(res, "Shop profile fetched", result);
    } catch (error) {
      if (error instanceof Error && error.message === "SHOP_NOT_FOUND") {
        throw new AppError(
          "Shop profile not found. Please complete onboarding first",
          404,
          "SHOP_NOT_FOUND",
        );
      }

      throw error;
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    const ownerUserId = ensureJeweller(req);

    const input = updateShopProfileSchema.parse(req.body);

    const useCase = makeUpdateShopProfileUseCase();

    try {
      const result = await useCase.execute({
        ownerUserId,
        ...input,
      });

      return sendSuccess(res, "Shop profile updated", result);
    } catch (error) {
      if (error instanceof Error && error.message === "SHOP_NOT_FOUND") {
        throw new AppError(
          "Shop profile not found. Please complete onboarding first",
          404,
          "SHOP_NOT_FOUND",
        );
      }

      throw error;
    }
  },
  async createProfilePhotoUploadUrl(req: AuthRequest, res: Response) {
  const ownerUserId = ensureJeweller(req);
  const input = profilePhotoUploadUrlSchema.parse(req.body);
  const useCase = makeCreateProfilePhotoUploadUrlUseCase();

  try {
    const result = await useCase.execute({
      ownerUserId,
      ...input,
    });

    return sendSuccess(res, "Profile photo upload URL created", result);
  } catch (error) {
    if (error instanceof Error && error.message === "UNSUPPORTED_FILE_TYPE") {
      throw new AppError(
        "Only JPG, PNG, and WebP images are allowed",
        400,
        "UNSUPPORTED_FILE_TYPE",
      );
    }

    if (error instanceof Error && error.message === "FILE_NAME_REQUIRED") {
      throw new AppError("File name is required", 400, "FILE_NAME_REQUIRED");
    }

    mapShopNotFound(error);
  }
},

async updateProfilePhoto(req: AuthRequest, res: Response) {
  const ownerUserId = ensureJeweller(req);
  const input = updateProfilePhotoSchema.parse(req.body);
  const useCase = makeUpdateShopProfilePhotoUseCase();

  try {
    const result = await useCase.execute({
      ownerUserId,
      ...input,
    });

    return sendSuccess(res, "Profile photo updated", result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_PROFILE_PHOTO_KEY"
    ) {
      throw new AppError(
        "Invalid profile photo key",
        400,
        "INVALID_PROFILE_PHOTO_KEY",
      );
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_PROFILE_PHOTO_URL"
    ) {
      throw new AppError(
        "Invalid profile photo URL",
        400,
        "INVALID_PROFILE_PHOTO_URL",
      );
    }

    mapShopNotFound(error);
  }
},
  
};