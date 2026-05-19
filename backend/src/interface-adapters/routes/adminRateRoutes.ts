import { Router } from 'express';
import { AdminRateController } from '../controllers/AdminRateController';
import { GetRateHistoryUseCase } from '../../use-cases/admin/rates/GetRateHistoryUseCase';
import { UpdateTodayGlobalRateUseCase } from '../../use-cases/admin/rates/UpdateTodayGlobalRateUseCase';
import { TriggerManualRateFetchUseCase } from '../../use-cases/admin/rates/TriggerManualRateFetchUseCase';
import { WinstonSentryLogger } from '../../frameworks-and-drivers/logging/WinstonSentryLogger';
import { MetalRatesApiService } from '../../frameworks-and-drivers/external-services/MetalRatesApiService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

export default function createAdminRateRoutes(): Router {
  const router = Router();
  const logger = new WinstonSentryLogger();
  
  // External Services
  const metalRatesApiService = new MetalRatesApiService(logger);

  // Instantiate Use Cases
  const getRateHistoryUseCase = new GetRateHistoryUseCase(logger);
  const updateTodayGlobalRateUseCase = new UpdateTodayGlobalRateUseCase(logger);
  const triggerManualRateFetchUseCase = new TriggerManualRateFetchUseCase(metalRatesApiService, logger);

  // Instantiate Controller
  const controller = new AdminRateController(
    getRateHistoryUseCase,
    updateTodayGlobalRateUseCase,
    triggerManualRateFetchUseCase,
    logger
  );

  router.use(authMiddleware, adminMiddleware);

  // Routes
  router.get('/history', controller.getHistory);
  router.post('/today', controller.updateTodayRate);
  router.post('/fetch', controller.triggerFetch); // New manual fetch route

  return router;
}