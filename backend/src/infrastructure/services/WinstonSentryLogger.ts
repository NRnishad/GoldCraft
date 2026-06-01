import winston from "winston";
import * as Sentry from "@sentry/node";
import { injectable } from "inversify";
import { ILogger } from "@application/interfaces/ILogger";
import { env } from "@config/env";

@injectable()
export class WinstonSentryLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    // Initialize Sentry Engine if a production DSN is present
    if (env.SENTRY_DSN) {
      Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NODE_ENV,
        tracesSampleRate: 1.0,
      });
    }

    // Define Winston formatting adjustments
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      env.NODE_ENV === "development"
        ? winston.format.colorize({ all: true })
        : winston.format.json(),
    );

    this.logger = winston.createLogger({
      level: env.NODE_ENV === "development" ? "debug" : "info",
      format: logFormat,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
              const metaString = Object.keys(meta).length
                ? ` | Meta: ${JSON.stringify(meta)}`
                : "";
              return `[${timestamp}] [${level}]: ${message}${
                stack ? `\nStack: ${stack}` : ""
              }${metaString}`;
            }),
          ),
        }),
      ],
    });
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  public error(
    message: string,
    error?: Error,
    meta?: Record<string, unknown>,
  ): void {
    this.logger.error(message, { error, ...meta });

    if (error && env.SENTRY_DSN) {
      Sentry.withScope((scope) => {
        if (meta) {
          scope.setExtras(meta);
        }
        Sentry.captureException(error);
      });
    }
  }
}
