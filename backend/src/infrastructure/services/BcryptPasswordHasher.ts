import bcrypt from "bcryptjs";
import { injectable } from "inversify";
import { IEncryptionService } from "@application/interfaces/IEncryptionService";

@injectable()
export class BcryptPasswordHasher implements IEncryptionService {
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
