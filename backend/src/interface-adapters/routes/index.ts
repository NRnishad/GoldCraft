import { Router } from "express";
import authRoutes from "./authRoutes";
import shopRoutes from "./shopRoutes";
import adminUserRoutes from "./adminUserRoutes";
import createAdminRateRoutes from "./adminRateRoutes";
import createShopRateRoutes from "./shopRateRoutes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/shop", shopRoutes);
router.use("/admin", adminUserRoutes);

router.use("/admin/rates", createAdminRateRoutes());
router.use("/shop/rates", createShopRateRoutes());

export default router;