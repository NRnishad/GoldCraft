import type { Response } from "express";

export function sendSuccess(
  res: Response,
  message: string,
  data: Record<string, unknown>,
) {
  res.json({ success: true, message, data });
}

