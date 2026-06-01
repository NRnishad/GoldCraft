export interface IRegisterEmailService {
  sendEmailVerificationOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void>;
}