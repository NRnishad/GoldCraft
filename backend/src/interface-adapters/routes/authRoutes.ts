import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", asyncHandler(AuthController.register));
router.post("/login", asyncHandler(AuthController.login));

router.post("/verify-email", asyncHandler(AuthController.verifyEmail));
router.post(
  "/resend-email-verification",
  asyncHandler(AuthController.resendEmailVerification),
);

router.get("/google", asyncHandler(AuthController.googleLogin));
router.get("/google/callback", asyncHandler(AuthController.googleCallback));

router.post("/forgot-password", asyncHandler(AuthController.forgotPassword));
router.post("/reset-password", asyncHandler(AuthController.resetPassword));

router.post("/change-password", authMiddleware, asyncHandler(AuthController.changePassword));

router.post("/refresh-token", asyncHandler(AuthController.refreshToken));
router.post("/logout", asyncHandler(AuthController.logout));

router.get("/me", authMiddleware, asyncHandler(AuthController.me));

router.get("/sentry-test", (req, res, next) => {
  try {
    throw new Error("This is a critical Sentry test exception!");
  } catch (error) {
    next(error); 
  }
})

export default router;