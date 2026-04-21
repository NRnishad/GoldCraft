import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AccessTokenPayload = {
  userId: string;
  role: "jeweller" | "admin";
};

export function issueAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "8h" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

