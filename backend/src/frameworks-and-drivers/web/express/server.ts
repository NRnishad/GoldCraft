import { createApp } from "./app";
import { connectDatabase } from "../../database/connection";
import { checkRedisConnection } from "../../otp/checkRedisConnection";
import { checkS3Connection } from "../../storage/checkS3Connection";
import { RateScheduler } from "../../cron/RateScheduler";
import { WinstonSentryLogger } from "../../logging/WinstonSentryLogger";
import { env } from "../../config/env";


const logger = new WinstonSentryLogger();

async function bootstrap(): Promise<void> {
  try {
    
    await connectDatabase();
    logger.info("MongoDB connected");
    await checkRedisConnection();
    logger.info("Redis connected");
    await checkS3Connection();
    logger.info("S3 connected");

   
    const rateScheduler = new RateScheduler(logger);
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