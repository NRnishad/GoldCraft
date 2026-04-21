import { connectDatabase } from "../frameworks-and-drivers/database/connection";
import { UserModel } from "../frameworks-and-drivers/database/models/UserModel";
import { BcryptPasswordHasher } from "../frameworks-and-drivers/security/BcryptPasswordHasher";

function readArg(flag: string) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function seedUser() {
  const name = readArg("--name") ?? "Demo User";
  const email = readArg("--email");
  const password = readArg("--password");
  const role = readArg("--role") === "admin" ? "admin" : "jeweller";

  if (!email || !password) {
    throw new Error(
      "Usage: npm run seed:user -- --email demo@example.com --password Password123 --name \"Demo User\" --role jeweller",
    );
  }

  await connectDatabase();

  const passwordHasher = new BcryptPasswordHasher();
  const passwordHash = await passwordHasher.hash(password);

  const user = await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log(`Seeded user: ${user.email} (${user.role})`);
  process.exit(0);
}

seedUser().catch((error) => {
  console.error(error);
  process.exit(1);
});
