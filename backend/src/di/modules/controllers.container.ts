import { ContainerModule } from "inversify";
import { TYPES } from "../types.di";
import { AuthController } from "@presentation/http/controllers/AuthController";
import { AdminController } from "@presentation/http/controllers/AdminController";
import { ShopController } from "@presentation/http/controllers/ShopController";
import { RateController } from "@presentation/http/controllers/RateController";
import { AuthenticateMiddleware } from "@presentation/http/middlewares/AuthenticateMiddleware";
import { AuthorizeMiddleware } from "@presentation/http/middlewares/AuthorizeMiddleware";

export const controllersContainer = new ContainerModule((options) => {
  // Middlewares
  options.bind<AuthenticateMiddleware>(TYPES.AuthenticateMiddleware).to(AuthenticateMiddleware).inSingletonScope();
  options.bind<AuthorizeMiddleware>(TYPES.AuthorizeMiddleware).to(AuthorizeMiddleware).inSingletonScope();

  // Controllers
  options.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
  options.bind<AdminController>(TYPES.AdminController).to(AdminController).inSingletonScope();
  options.bind<ShopController>(TYPES.ShopController).to(ShopController).inSingletonScope();
  options.bind<RateController>(TYPES.RateController).to(RateController).inSingletonScope();
});
