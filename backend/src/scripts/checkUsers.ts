import "reflect-metadata";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env
dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/goldcraft";

async function main() {
  console.log("Connecting to MongoDB at:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("Connected successfully.");

  const db = mongoose.connection.db!;
  const usersCollection = db.collection("users");

  const allUsers = await usersCollection.find({}).toArray();
  console.log(`Found ${allUsers.length} users in database:`);
  
  for (const user of allUsers) {
    console.log({
      id: user._id,
      email: user.email,
      name: user.name,
      authProvider: user.authProvider,
      hasPasswordHash: !!user.passwordHash,
      passwordHash: user.passwordHash,
      googleId: user.googleId,
    });
  }

  await mongoose.disconnect();
}

main().catch(console.error);
