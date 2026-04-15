import { z } from "zod";

const billingCycleSchema = z.enum(["monthly", "yearly"]);

const emailSchema = z
  .string()
  .trim()
  .max(254, "Email must be at most 254 characters long.")
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password must be at most 128 characters long.");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long.")
  .max(100, "Name must be at most 100 characters long.");

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Enter a valid MongoDB object id.");

const otpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "OTP code must be exactly 6 digits.");

/**
 * Validates the public register payload before the auth controller calls the register use case.
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    planId: objectIdSchema,
    billingCycle: billingCycleSchema,
    referralCode: z.string().trim().min(1).optional(),
  })
  .strict();

/**
 * Validates login input before password comparison begins.
 */
export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

/**
 * Validates the email verification form that carries the OTP.
 */
export const verifyEmailSchema = z
  .object({
    email: emailSchema,
    code: otpCodeSchema,
  })
  .strict();

/**
 * Validates the resend-verification payload for email-only throttle checks.
 */
export const resendVerificationSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

/**
 * Validates the forgot-password payload before reset-token generation.
 */
export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

/**
 * Validates the reset-password payload before hashing the new password.
 */
export const resetPasswordSchema = z
  .object({
    resetToken: z.string().trim().min(1, "Reset token is required."),
    password: passwordSchema,
  })
  .strict();

/**
 * Validates the authenticated change-password payload.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Small auth validator barrel for route-level imports later.
 */
export const authValidators = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
