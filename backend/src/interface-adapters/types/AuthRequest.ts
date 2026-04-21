import type { Request } from "express";

export type AuthRequest = Request & {
  user?: {
    userId: string;
    role: "jeweller" | "admin";
  };
};

