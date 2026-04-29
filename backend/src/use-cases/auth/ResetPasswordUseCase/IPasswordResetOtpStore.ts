export interface IResetPasswordOtpStore {
  get(email: string): Promise<string | null>;
  delete(email: string): Promise<void>;
}