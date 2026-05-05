import { Router } from "express";
import { ShopController } from "../controllers/ShopController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/onboarding",
  authMiddleware,
  asyncHandler(ShopController.getOnboardingState),
);

router.post(
  "/onboarding",
  authMiddleware,
  asyncHandler(ShopController.saveOnboarding),
);

router.get(
  "/profile",
  authMiddleware,
  asyncHandler(ShopController.getProfile),
);

router.put(
  "/profile",
  authMiddleware,
  asyncHandler(ShopController.updateProfile),
);
router.post(
  "/profile/photo/upload-url",
  authMiddleware,
  asyncHandler(ShopController.createProfilePhotoUploadUrl),
);

router.put(
  "/profile/photo",
  authMiddleware,
  asyncHandler(ShopController.updateProfilePhoto),
);
export default router;