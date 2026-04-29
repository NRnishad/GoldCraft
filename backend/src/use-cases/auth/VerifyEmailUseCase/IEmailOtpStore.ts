export interface IVerifyEmailOtpStore {
  get(email: string): Promise<string | null>;
  delete(email: string): Promise<void>;
}