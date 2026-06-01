import { Router } from "express";
import { container } from "@di/container";
import { TYPES } from "@di/types.di";
import { AdminController } from "../controllers/AdminController";
import { RateController } from "../controllers/RateController";
import { AuthenticateMiddleware } from "../middlewares/AuthenticateMiddleware";
import { AuthorizeMiddleware } from "../middlewares/AuthorizeMiddleware";
import { ROUTES } from "../../constants/Routes.constant";
import { UserRole } from "@domain/entities/User.entity";

const router = Router();
const adminController = container.get<AdminController>(TYPES.AdminController);
const rateController = container.get<RateController>(TYPES.RateController);
const authenticateMiddleware = container.get<AuthenticateMiddleware>(TYPES.AuthenticateMiddleware);
const authorizeMiddleware = container.get<AuthorizeMiddleware>(TYPES.AuthorizeMiddleware);

// All admin routes are protected by auth and admin role
router.use(authenticateMiddleware.authenticate, authorizeMiddleware.authorize([UserRole.ADMIN]));

router.get(ROUTES.ADMIN.LIST_USERS, adminController.listUsers);
router.get(ROUTES.ADMIN.USER_DETAILS, adminController.getUserDetails);
router.patch(ROUTES.ADMIN.USER_STATUS, adminController.updateUserStatus);
router.patch(ROUTES.ADMIN.USER_ROLE, adminController.updateUserRole);

router.post(ROUTES.ADMIN.UPDATE_GLOBAL_RATE, rateController.updateTodayRate);
router.get(ROUTES.ADMIN.RATE_HISTORY, rateController.getHistory);
router.post(ROUTES.ADMIN.SYNC_RATES, rateController.triggerFetch);

export default router;
