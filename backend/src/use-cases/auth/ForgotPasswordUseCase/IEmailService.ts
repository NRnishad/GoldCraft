export interface IForgotPasswordEmailService {
  sendPasswordResetOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void>;
}