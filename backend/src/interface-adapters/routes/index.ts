import { Router } from "express";
import authRoutes from "./authRoutes";
import shopRoutes from "./shopRoutes";
import adminUserRoutes from "./adminUserRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/shop", shopRoutes);
router.use("/admin", adminUserRoutes);

export default router;