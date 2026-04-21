import { env } from "../../config/env";
import { connectDatabase } from "../../database/connection";
import { app } from "./app";

async function startServer() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});

