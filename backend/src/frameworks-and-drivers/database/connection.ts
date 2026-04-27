import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGO_URI);

  console.log("MongoDB connected");
}