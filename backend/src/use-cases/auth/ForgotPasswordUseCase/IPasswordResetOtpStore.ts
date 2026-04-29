export interface IForgotPasswordResetOtpStore {
  save(email: string, otp: string): Promise<void>;
}