import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", asyncHandler(AuthController.login));
router.get("/me", authMiddleware, asyncHandler(AuthController.me));

export const authRoutes = router;

