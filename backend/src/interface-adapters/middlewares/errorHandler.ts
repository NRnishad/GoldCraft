import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.code,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: "INTERNAL_ERROR",
  });
}