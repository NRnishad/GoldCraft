import bcrypt from "bcryptjs";
import { IRegisterPasswordHasher } from "@use-cases/auth/RegisterUserUseCase/IPasswordHasher";
import { ILoginPasswordHasher } from "@use-cases/auth/LoginUserUseCase/IPasswordHasher";

export class BcryptPasswordHasher
  implements IRegisterPasswordHasher, ILoginPasswordHasher
{
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}