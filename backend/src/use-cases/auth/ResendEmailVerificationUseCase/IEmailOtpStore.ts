export interface IResendEmailVerificationOtpStore {
  save(email: string, otp: string): Promise<void>;
}