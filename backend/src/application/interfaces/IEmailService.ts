export interface IEmailService {
  sendEmailVerificationOtp(input: { to: string; name: string; otp: string }): Promise<void>;
  sendPasswordResetOtp(input: { to: string; name: string; otp: string }): Promise<void>;
}
