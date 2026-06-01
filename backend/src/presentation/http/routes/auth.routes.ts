import { Router, Request, Response, NextFunction } from "express";
import { container } from "@di/container";
import { TYPES } from "@di/types.di";
import { AuthController } from "../controllers/AuthController";
import { AuthenticateMiddleware } from "../middlewares/AuthenticateMiddleware";
import { ROUTES } from "../../constants/Routes.constant";

const router = Router();
const controller = container.get<AuthController>(TYPES.AuthController);
const authMiddleware = container.get<AuthenticateMiddleware>(TYPES.AuthenticateMiddleware);

router.post(ROUTES.AUTH.REGISTER, controller.register);
router.post(ROUTES.AUTH.LOGIN, controller.login);
router.post(ROUTES.AUTH.VERIFY_EMAIL, controller.verifyEmail);
router.post(ROUTES.AUTH.RESEND_VERIFICATION, controller.resendEmailVerification);
router.get(ROUTES.AUTH.GOOGLE, controller.googleLogin);
router.get(ROUTES.AUTH.GOOGLE_CALLBACK, controller.googleCallback);
router.post(ROUTES.AUTH.FORGOT_PASSWORD, controller.forgotPassword);
router.post(ROUTES.AUTH.RESET_PASSWORD, controller.resetPassword);
router.post(ROUTES.AUTH.REFRESH_TOKEN, controller.refreshToken);
router.post(ROUTES.AUTH.LOGOUT, controller.logout);

// Protected routes
router.post(ROUTES.AUTH.CHANGE_PASSWORD, authMiddleware.authenticate, controller.changePassword);
router.get(ROUTES.AUTH.ME, authMiddleware.authenticate, controller.me);

router.get("/sentry-test", (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("This is a critical Sentry test exception!");
  } catch (error) {
    next(error); 
  }
});

export default router;
