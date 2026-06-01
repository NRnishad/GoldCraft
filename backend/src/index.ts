import "reflect-metadata";
import { createApp } from "./presentation/http/app";
import { connectDatabase } from "./infrastructure/database/connection";
import { checkRedisConnection } from "./infrastructure/otp/checkRedisConnection";
import { checkS3Connection } from "./infrastructure/storage/checkS3Connection";
import { RateScheduler } from "./infrastructure/cron/RateScheduler";
import { container } from "@di/container";
import { TYPES } from "@di/types.di";
import { ILogger } from "@application/interfaces/ILogger";
import { env } from "@config/env";

const logger = container.get<ILogger>(TYPES.ILogger);

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
    logger.info("MongoDB connected");

    await checkRedisConnection();
    logger.info("Redis connected");

    await checkS3Connection();
    logger.info("S3 connected");

    // Resolve RateScheduler from the DI container (all deps auto-injected)
    const rateScheduler = container.get<RateScheduler>(TYPES.RateScheduler);
    rateScheduler.initialize();

    const app = createApp();

    app.listen(env.PORT, () => {
      logger.info(`Server successfully running and listening on port ${env.PORT}`);
    });
  } catch (error: any) {
    logger.error(`Critical failure during server bootstrap: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();
