import { Request, Response, NextFunction } from 'express';
import { GetRateHistoryUseCase } from '../../use-cases/admin/rates/GetRateHistoryUseCase';
import { UpdateTodayGlobalRateUseCase } from '../../use-cases/admin/rates/UpdateTodayGlobalRateUseCase';
import { TriggerManualRateFetchUseCase } from '../../use-cases/admin/rates/TriggerManualRateFetchUseCase';
import { ILogger } from '../../use-cases/ports/ILogger';
import { sendSuccess } from '../utils/response';

export class AdminRateController {
  constructor(
    private getRateHistoryUseCase: GetRateHistoryUseCase,
    private updateTodayGlobalRateUseCase: UpdateTodayGlobalRateUseCase,
    private triggerManualRateFetchUseCase: TriggerManualRateFetchUseCase,
    private logger: ILogger
  ) {}

  public getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const rates = await this.getRateHistoryUseCase.execute(days);
      sendSuccess(res, 'Rate history fetched successfully', { rates }, 200);
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
        isMarketHoliday: Boolean(req.body.isMarketHoliday)
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
      sendSuccess(res, 'Live rates fetched and stored successfully', { rate: updatedRate }, 200);
    } catch (error) {
      next(error);
    }
  };
}