import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { GetRateHistoryUseCase } from "@application/usecases/rates/GetRateHistoryUseCase";
import { TriggerManualRateFetchUseCase } from "@application/usecases/rates/TriggerManualRateFetchUseCase";
import { UpdateTodayGlobalRateUseCase } from "@application/usecases/rates/UpdateTodayGlobalRateUseCase";
import { GetShopTodayRateUseCase } from "@application/usecases/rates/GetShopTodayRateUseCase";
import { UpdateShopRateOverrideUseCase } from "@application/usecases/rates/UpdateShopRateOverrideUseCase";

import { sendSuccess } from "../helpers/response";
import { AppError } from "@application/errors/AppError";
import { AuthRequest } from "../middlewares/AuthenticateMiddleware";

@injectable()
export class RateController {
  constructor(
    @inject(TYPES.GetRateHistoryUseCase)
    private readonly getRateHistoryUseCase: GetRateHistoryUseCase,
    @inject(TYPES.TriggerManualRateFetchUseCase)
    private readonly triggerManualRateFetchUseCase: TriggerManualRateFetchUseCase,
    @inject(TYPES.UpdateTodayGlobalRateUseCase)
    private readonly updateTodayGlobalRateUseCase: UpdateTodayGlobalRateUseCase,
    @inject(TYPES.GetShopTodayRateUseCase)
    private readonly getShopTodayRateUseCase: GetShopTodayRateUseCase,
    @inject(TYPES.UpdateShopRateOverrideUseCase)
    private readonly updateShopRateOverrideUseCase: UpdateShopRateOverrideUseCase,
  ) {}

  // Shop Rates Methods
  public getTodayRate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized access", 401, "UNAUTHORIZED");
      }

      const effectiveRate = await this.getShopTodayRateUseCase.execute(req.user.userId);
      sendSuccess(res, "Today's effective shop rate fetched successfully", { rate: effectiveRate }, 200);
    } catch (error) {
      next(error);
    }
  };

  public updateRateOverride = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new AppError("Unauthorized access", 401, "UNAUTHORIZED");
      }

      const input = {
        userId: req.user.userId,
        rate22KPerGram: req.body.rate22KPerGram !== undefined ? Number(req.body.rate22KPerGram) : undefined,
        rate18KPerGram: req.body.rate18KPerGram !== undefined ? Number(req.body.rate18KPerGram) : undefined,
        silverPerGram: req.body.silverPerGram !== undefined ? Number(req.body.silverPerGram) : undefined,
      };

      await this.updateShopRateOverrideUseCase.execute(input);
      sendSuccess(res, "Shop rate override applied successfully for today", null, 200);
    } catch (error) {
      next(error);
    }
  };

  // Admin Rates Methods
  public getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const rates = await this.getRateHistoryUseCase.execute(days);
      sendSuccess(res, "Rate history fetched successfully", { rates }, 200);
    } catch (error) {
      next(error);
    }
  };

  public updateTodayRate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = {
        rate22KPerGram: Number(req.body.rate22KPerGram),
        rate18KPerGram: Number(req.body.rate18KPerGram),
        silverPerGram: Number(req.body.silverPerGram),
        isMarketHoliday: Boolean(req.body.isMarketHoliday),
      };

      const updatedRate = await this.updateTodayGlobalRateUseCase.execute(input);
      sendSuccess(res, "Today's rate updated successfully by Admin", { rate: updatedRate }, 200);
    } catch (error) {
      next(error);
    }
  };

  public triggerFetch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedRate = await this.triggerManualRateFetchUseCase.execute();
      sendSuccess(res, "Live rates fetched and stored successfully", { rate: updatedRate }, 200);
    } catch (error) {
      next(error);
    }
  };
}
