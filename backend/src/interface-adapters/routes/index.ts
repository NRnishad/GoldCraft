import { Router } from "express";
import { authRoutes } from "./authRoutes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/api/auth", authRoutes);

export const routes = router;

