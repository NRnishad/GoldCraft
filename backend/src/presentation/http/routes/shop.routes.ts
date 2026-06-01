import { Router } from "express";
import { container } from "@di/container";
import { TYPES } from "@di/types.di";
import { ShopController } from "../controllers/ShopController";
import { RateController } from "../controllers/RateController";
import { AuthenticateMiddleware } from "../middlewares/AuthenticateMiddleware";
import { AuthorizeMiddleware } from "../middlewares/AuthorizeMiddleware";
import { ROUTES } from "../../constants/Routes.constant";
import { UserRole } from "@domain/entities/User.entity";

const router = Router();
const shopController = container.get<ShopController>(TYPES.ShopController);
const rateController = container.get<RateController>(TYPES.RateController);
const authenticateMiddleware = container.get<AuthenticateMiddleware>(TYPES.AuthenticateMiddleware);
const authorizeMiddleware = container.get<AuthorizeMiddleware>(TYPES.AuthorizeMiddleware);

// All shop routes are protected by auth and jeweller role
router.use(authenticateMiddleware.authenticate, authorizeMiddleware.authorize([UserRole.JEWELLER]));

router.get(ROUTES.SHOP.ONBOARDING_STATE, shopController.getOnboardingState);
router.post(ROUTES.SHOP.SAVE_ONBOARDING, shopController.saveOnboarding);
router.get(ROUTES.SHOP.PROFILE, shopController.getProfile);
router.put(ROUTES.SHOP.PROFILE, shopController.updateProfile);
router.post(ROUTES.SHOP.PHOTO_URL, shopController.createProfilePhotoUploadUrl);
router.put(ROUTES.SHOP.PHOTO, shopController.updateProfilePhoto);

router.get(ROUTES.SHOP.TODAY_RATE, rateController.getTodayRate);
router.post(ROUTES.SHOP.RATE_OVERRIDE, rateController.updateRateOverride);

export default router;
