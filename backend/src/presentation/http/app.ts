import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";
import { container } from "@di/container";
import { TYPES } from "@di/types.di";
import { ILogger } from "@application/interfaces/ILogger";
import { env } from "@config/env";

export function createApp() {
  const app = express();
  const logger = container.get<ILogger>(TYPES.ILogger);

  app.use(helmet());

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());

  process.on("unhandledRejection", (reason: any) => {
    logger.error("CRITICAL: Unhandled Promise Rejection Intercepted", reason instanceof Error ? reason : new Error(String(reason)));
  });

  process.on("uncaughtException", (error: Error) => {
    logger.error("CRITICAL: Uncaught Exception Intercepted", error);
    process.exit(1);
  });

  app.get("/health", (_req: express.Request, res: express.Response) => {
    res.json({
      success: true,
      message: "Server is running",
    });
  });

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}
