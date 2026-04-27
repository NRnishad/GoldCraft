import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "../../../interface-adapters/routes/index";
import { errorHandler } from "@adapters/middlewares/errorHandler";
import { env } from "../../config/env";

export function createApp() {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      message: "Server is running",
    });
  });

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}