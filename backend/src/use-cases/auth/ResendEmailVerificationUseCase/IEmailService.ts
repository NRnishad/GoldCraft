export interface IResendEmailVerificationEmailService {
  sendEmailVerificationOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void>;
}