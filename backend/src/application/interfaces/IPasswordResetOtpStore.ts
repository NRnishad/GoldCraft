import { OtpData } from "./IEmailOtpStore";

export interface IPasswordResetOtpStore {
  save(email: string, otp: string): Promise<void>;
  get(email: string): Promise<OtpData | null>;
  delete(email: string): Promise<void>;
}
