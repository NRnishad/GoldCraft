import { Router } from "express";
import { AdminUserController } from "../controllers/AdminUserController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/users", asyncHandler(AdminUserController.listUsers));

router.get(
  "/users/:userId",
  asyncHandler(AdminUserController.getUserDetails),
);

router.patch(
  "/users/:userId/status",
  asyncHandler(AdminUserController.updateUserStatus),
);

router.patch(
  "/users/:userId/role",
  asyncHandler(AdminUserController.updateUserRole),
);

export default router;