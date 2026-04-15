import type { Request } from "express";

/**
 * Adapter-level JWT payload shape attached by `authMiddleware`.
 * Authenticated controllers such as profile, shop, and billing read this field.
 */
export interface AuthUserPayload {
  userId: string;
  role: "admin" | "jeweller";
  authVersion: number;
  iat?: number;
  exp?: number;
  jti?: string;
}

/**
 * Express request extended with the authenticated user context.
 * Public routes may not have `user`, so the field stays optional here.
 */
export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}
