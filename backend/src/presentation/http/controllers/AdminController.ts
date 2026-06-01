import { Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@di/types.di";
import { GetUserDetailsUseCase } from "@application/usecases/admin/GetUserDetailsUseCase";
import { ListUsersUseCase } from "@application/usecases/admin/ListUsersUseCase";
import { UpdateUserRoleUseCase } from "@application/usecases/admin/UpdateUserRoleUseCase";
import { UpdateUserStatusUseCase } from "@application/usecases/admin/UpdateUserStatusUseCase";
import { UserRole } from "@domain/entities/User.entity";

import {
  listUsersQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdParamSchema,
} from "../validators/adminUser.validator";
import { sendSuccess } from "../helpers/response";
import { AppError } from "@application/errors/AppError";
import { AuthRequest } from "../middlewares/AuthenticateMiddleware";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.GetUserDetailsUseCase)
    private readonly getUserDetailsUseCase: GetUserDetailsUseCase,
    @inject(TYPES.ListUsersUseCase)
    private readonly listUsersUseCase: ListUsersUseCase,
    @inject(TYPES.UpdateUserRoleUseCase)
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    @inject(TYPES.UpdateUserStatusUseCase)
    private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,
  ) {}

  private getAdminUserId(req: AuthRequest): string {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    return req.user.userId;
  }

  public listUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = listUsersQuerySchema.parse(req.query);
      const result = await this.listUsersUseCase.execute({
        search: query.search,
        role: query.role as UserRole | undefined,
        isActive: query.isActive,
        isEmailVerified: query.isEmailVerified,
        page: query.page,
        limit: query.limit,
      });

      sendSuccess(res, "Users fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public getUserDetails = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = userIdParamSchema.parse(req.params);
      const result = await this.getUserDetailsUseCase.execute({
        userId: params.userId,
      });

      sendSuccess(res, "User details fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public updateUserStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminUserId = this.getAdminUserId(req);
      const params = userIdParamSchema.parse(req.params);
      const body = updateUserStatusSchema.parse(req.body);

      const result = await this.updateUserStatusUseCase.execute({
        adminUserId,
        targetUserId: params.userId,
        isActive: body.isActive,
      });

      sendSuccess(res, "User status updated successfully", result);
    } catch (error) {
      next(error);
    }
  };

  public updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminUserId = this.getAdminUserId(req);
      const params = userIdParamSchema.parse(req.params);
      const body = updateUserRoleSchema.parse(req.body);

      const result = await this.updateUserRoleUseCase.execute({
        adminUserId,
        targetUserId: params.userId,
        role: body.role as UserRole,
      });

      sendSuccess(res, "User role updated successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
