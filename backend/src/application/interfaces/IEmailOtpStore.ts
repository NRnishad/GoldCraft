export interface OtpData {
  otp: string;
  createdAt: number;
}

export interface IEmailOtpStore {
  save(email: string, otp: string): Promise<void>;
  get(email: string): Promise<OtpData | null>;
  delete(email: string): Promise<void>;
}
