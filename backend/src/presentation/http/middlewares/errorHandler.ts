import { Request, Response, NextFunction } from "express";
import { AppError } from "@application/errors/AppError";
import { container } from "@di/container";
import { TYPES } from "@di/types.di";
import { ILogger } from "@application/interfaces/ILogger";
import { env } from "@config/env";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const logger = container.get<ILogger>(TYPES.ILogger);

  const correlationData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  };

  if (error instanceof AppError) {
    logger.warn(`Operational Handled Exception [${error.statusCode}]: ${error.message}`, correlationData);
    
    let parsedStatus = Number(error.statusCode);
    if (isNaN(parsedStatus) || parsedStatus < 100 || parsedStatus > 599) {
      logger.error("Developer Error: AppError thrown with invalid status code format.", error);
      parsedStatus = 500;
    }

    res.status(parsedStatus).json({
      success: false,
      message: typeof error.message === 'string' ? error.message : "An error occurred",
    });
    return;
  }

  // Zod Validation Error handling
  if (error.name === "ZodError" || (error as any).issues) {
    logger.warn(`Validation Exception: ${error.message}`, correlationData);
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: (error as any).errors || (error as any).issues,
    });
    return;
  }

  logger.error(`Unhandled unexpected exception triggered: ${error.message}`, error, correlationData);

  const responseMessage = env.NODE_ENV === "development" 
    ? error.message 
    : "An internal server error occurred.";

  res.status(500).json({
    success: false,
    message: responseMessage,
  });
}
