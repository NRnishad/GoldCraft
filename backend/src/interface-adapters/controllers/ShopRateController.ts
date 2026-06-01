import { Request, Response, NextFunction } from 'express';
import { GetShopTodayRateUseCase } from '../../use-cases/shop/rates/GetShopTodayRateUseCase';
import { UpdateShopRateOverrideUseCase } from '../../use-cases/shop/rates/UpdateShopRateOverrideUseCase';
import { ILogger } from '../../use-cases/ports/ILogger';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middlewares/authMiddleware';

export class ShopRateController {
  constructor(
    private getShopTodayRateUseCase: GetShopTodayRateUseCase,
    private updateShopRateOverrideUseCase: UpdateShopRateOverrideUseCase,
    private logger: ILogger
  ) {}

  public getTodayRate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.userId) {
         throw new AppError('Unauthorized access', 401, 'UNAUTHORIZED');
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
         throw new AppError('Unauthorized access', 401, 'UNAUTHORIZED');
      }

      const input = {
        userId: req.user.userId,
        rate22KPerGram: req.body.rate22KPerGram ? Number(req.body.rate22KPerGram) : undefined,
        rate18KPerGram: req.body.rate18KPerGram ? Number(req.body.rate18KPerGram) : undefined,
        silverPerGram: req.body.silverPerGram ? Number(req.body.silverPerGram) : undefined,
      };

      await this.updateShopRateOverrideUseCase.execute(input);
      

      sendSuccess(res, 'Shop rate override applied successfully for today', null, 200);
    } catch (error) {
      next(error);
    }
  };
}