export interface IRegisterPasswordHasher {
  hash(password: string): Promise<string>;
}