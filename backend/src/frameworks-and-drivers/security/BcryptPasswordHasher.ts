import bcrypt from "bcryptjs";
import { IRegisterPasswordHasher } from "@use-cases/auth/RegisterUserUseCase/IPasswordHasher";
import { ILoginPasswordHasher } from "@use-cases/auth/LoginUserUseCase/IPasswordHasher";
import { IResetPasswordHasher } from "@use-cases/auth/ResetPasswordUseCase/IPasswordHasher";

export class BcryptPasswordHasher
  implements IRegisterPasswordHasher, ILoginPasswordHasher, IResetPasswordHasher
{
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}