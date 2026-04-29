export interface IRegisterEmailOtpStore {
  save(email: string, otp: string): Promise<void>;
}