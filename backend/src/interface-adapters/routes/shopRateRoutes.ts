import { Router } from 'express';
import { ShopRateController } from '../controllers/ShopRateController';
import { GetShopTodayRateUseCase } from '../../use-cases/shop/rates/GetShopTodayRateUseCase';
import { UpdateShopRateOverrideUseCase } from '../../use-cases/shop/rates/UpdateShopRateOverrideUseCase';
import { WinstonSentryLogger } from '../../frameworks-and-drivers/logging/WinstonSentryLogger';
import { authMiddleware } from '../middlewares/authMiddleware';

export default function createShopRateRoutes(): Router {
  const router = Router();
  const logger = new WinstonSentryLogger();


  const getShopTodayRateUseCase = new GetShopTodayRateUseCase(logger);
  const updateShopRateOverrideUseCase = new UpdateShopRateOverrideUseCase(logger);

  const controller = new ShopRateController(
    getShopTodayRateUseCase,
    updateShopRateOverrideUseCase,
    logger
  );


  router.use(authMiddleware);


  router.get('/today', controller.getTodayRate);
  router.post('/override', controller.updateRateOverride);

  return router;
}