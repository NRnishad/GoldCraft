import nodemailer from "nodemailer";
import { env } from "@drivers/config/env";

export interface EmailService {
  sendEmailVerificationOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void>;

  sendPasswordResetOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void>;
}

export class NodemailerEmailService implements EmailService {
  private readonly transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  async sendEmailVerificationOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: `"Gold Craft" <${env.EMAIL_USER}>`,
      to: input.to,
      subject: "Verify your Gold Craft email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2>Welcome to Gold Craft, ${input.name}</h2>
          <p>Use this OTP to verify your email address:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 24px 0;">
            ${input.otp}
          </div>
          <p>This OTP will expire in ${Math.floor(
            env.EMAIL_OTP_EXPIRES_SECONDS / 60,
          )} minutes.</p>
          <p>If you did not create this account, you can ignore this email.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: `"Gold Craft" <${env.EMAIL_USER}>`,
      to: input.to,
      subject: "Reset your Gold Craft password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2>Hello ${input.name}</h2>
          <p>Use this OTP to reset your Gold Craft password:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 24px 0;">
            ${input.otp}
          </div>
          <p>This OTP will expire in ${Math.floor(
            env.EMAIL_OTP_EXPIRES_SECONDS / 60,
          )} minutes.</p>
          <p>If you did not request a password reset, you can ignore this email.</p>
        </div>
      `,
    });
  }
}