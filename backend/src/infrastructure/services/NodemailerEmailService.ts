import nodemailer from "nodemailer";
import { injectable } from "inversify";
import { IEmailService } from "@application/interfaces/IEmailService";
import { env } from "@config/env";

@injectable()
export class NodemailerEmailService implements IEmailService {
  private readonly transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  public async sendEmailVerificationOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: `"Gold Craft" <${env.EMAIL_USER}>`,
      to: input.to,
      subject: "Verify your Gold Craft email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px;">
          <h2 style="color: #d97706; margin-bottom: 16px;">Welcome to Gold Craft, ${input.name}</h2>
          <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 24px 0; color: #1e293b; background: #f8fafc; padding: 12px; text-align: center; border-radius: 6px;">
            ${input.otp}
          </div>
          <p>This verification code is valid for <strong>${Math.floor(env.EMAIL_OTP_EXPIRES_SECONDS / 60)} minutes</strong>.</p>
          <p style="color: #64748b; font-size: 14px; margin-top: 24px;">If you did not create this account, you can safely ignore this email.</p>
        </div>
      `,
    });
  }

  public async sendPasswordResetOtp(input: {
    to: string;
    name: string;
    otp: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: `"Gold Craft" <${env.EMAIL_USER}>`,
      to: input.to,
      subject: "Reset your Gold Craft password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px;">
          <h2 style="color: #d97706; margin-bottom: 16px;">Password Reset Request</h2>
          <p>Hello ${input.name},</p>
          <p>We received a request to reset your Gold Craft password. Use the following One-Time Password (OTP) to proceed with the reset:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 24px 0; color: #1e293b; background: #f8fafc; padding: 12px; text-align: center; border-radius: 6px;">
            ${input.otp}
          </div>
          <p>This verification code is valid for <strong>${Math.floor(env.EMAIL_OTP_EXPIRES_SECONDS / 60)} minutes</strong>.</p>
          <p style="color: #64748b; font-size: 14px; margin-top: 24px;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });
  }
}
