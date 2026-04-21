import bcrypt from "bcryptjs";

export class BcryptPasswordHasher {
  async compare(plainText: string, passwordHash: string) {
    return bcrypt.compare(plainText, passwordHash);
  }

  async hash(plainText: string) {
    return bcrypt.hash(plainText, 10);
  }
}

