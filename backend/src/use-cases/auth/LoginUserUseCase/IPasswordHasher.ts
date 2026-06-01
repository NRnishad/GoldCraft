export interface ILoginPasswordHasher {
  compare(password: string, passwordHash: string): Promise<boolean>;
}