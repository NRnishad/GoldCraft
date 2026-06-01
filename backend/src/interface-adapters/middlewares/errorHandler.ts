import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { appLogger } from "../../frameworks-and-drivers/logging/WinstonSentryLogger";
import { env } from "../../frameworks-and-drivers/config/env";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const correlationData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  };

if (error instanceof AppError) {
    appLogger.warn(`Operational Handled Exception [${error.statusCode}]: ${error.message}`, correlationData);
    
    
    let parsedStatus = Number(error.statusCode);
    if (isNaN(parsedStatus) || parsedStatus < 100 || parsedStatus > 599) {
      appLogger.error("Developer Error: AppError thrown with invalid status code format.", error);
      parsedStatus = 500;
    }

    res.status(parsedStatus).json({
      success: false,
      message: typeof error.message === 'string' ? error.message : "An error occurred",
    });
    return;
  }
  appLogger.error(`Unhandled unexpected exception triggered: ${error.message}`, error, correlationData);

  const responseMessage = env.NODE_ENV === "development" 
    ? error.message 
    : "An internal server error occurred.";

  res.status(500).json({
    success: false,
    message: responseMessage,
  });
}