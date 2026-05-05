import { createApp } from "./app";
import { connectDatabase } from "../../database/connection";
import { checkRedisConnection } from "@drivers/otp/checkRedisConnection";
import { checkS3Connection } from "@drivers/storage/checkS3Connection";
import { env } from "../../config/env";

async function bootstrap() {
  await connectDatabase();
  await checkRedisConnection();
  await checkS3Connection();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});