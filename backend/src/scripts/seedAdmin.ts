/**
 * Admin Seed Script
 * Creates a fresh admin user with a UUID string _id (compatible with new schema).
 * Run with: npx ts-node -r tsconfig-paths/register src/scripts/seedAdmin.ts
 */

import "reflect-metadata";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;
const ADMIN_EMAIL = "adminnishad@gmail.com";
const ADMIN_PASSWORD = "Adminnishad123";
const ADMIN_NAME = "Admin Nishad";

async function seedAdmin() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected\n");

  const db = mongoose.connection.db!;
  const usersCollection = db.collection("users");

  // Remove any existing user with this email (old ObjectId-based or duplicate)
  const existing = await usersCollection.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`⚠️  Found existing user with email ${ADMIN_EMAIL} (_id type: ${typeof existing._id})`);
    await usersCollection.deleteOne({ email: ADMIN_EMAIL });
    console.log("🗑️  Deleted old admin document\n");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const newId = crypto.randomUUID(); // UUID string — compatible with new String _id schema
  const now = new Date();

  const adminDoc = {
    _id: newId,                     // UUID string (new schema)
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash,
    role: "admin",
    authProvider: "local",
    // googleId omitted — sparse index skips missing fields (not null)
    isActive: true,
    isEmailVerified: true,          // Skip email verification for seeded admin
    createdAt: now,
    updatedAt: now,
  };

  await usersCollection.insertOne(adminDoc as any);

  console.log("✅ Admin user created successfully!");
  console.log("──────────────────────────────────────");
  console.log(`  Email    : ${ADMIN_EMAIL}`);
  console.log(`  Password : ${ADMIN_PASSWORD}`);
  console.log(`  Role     : admin`);
  console.log(`  _id      : ${newId}`);
  console.log("──────────────────────────────────────\n");

  await mongoose.disconnect();
  console.log("🔌 Disconnected. Done!");
}

seedAdmin().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
