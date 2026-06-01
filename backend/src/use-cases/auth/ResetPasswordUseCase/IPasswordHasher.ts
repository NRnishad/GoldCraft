export interface IResetPasswordHasher {
  hash(password: string): Promise<string>;
}