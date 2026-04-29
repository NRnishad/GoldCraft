import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  makeGetUserDetailsUseCase,
  makeListUsersUseCase,
  makeUpdateUserRoleUseCase,
  makeUpdateUserStatusUseCase,
} from "../factories/AdminUserFactory";
import {
  listUsersQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdParamSchema,
} from "../validators/adminUserValidators";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";

function getAdminUserId(req: AuthRequest): string {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.userId;
}

export const AdminUserController = {
  async listUsers(req: AuthRequest, res: Response) {
    const query = listUsersQuerySchema.parse(req.query);

    const useCase = makeListUsersUseCase();

    const result = await useCase.execute({
      search: query.search,
      role: query.role,
      isActive: query.isActive,
      isEmailVerified: query.isEmailVerified,
      page: query.page,
      limit: query.limit,
    });

    return sendSuccess(res, "Users fetched successfully", result);
  },

  async getUserDetails(req: AuthRequest, res: Response) {
    const params = userIdParamSchema.parse(req.params);

    const useCase = makeGetUserDetailsUseCase();

    try {
      const result = await useCase.execute({
        userId: params.userId,
      });

      return sendSuccess(res, "User details fetched successfully", result);
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      throw error;
    }
  },

  async updateUserStatus(req: AuthRequest, res: Response) {
    const adminUserId = getAdminUserId(req);
    const params = userIdParamSchema.parse(req.params);
    const body = updateUserStatusSchema.parse(req.body);

    const useCase = makeUpdateUserStatusUseCase();

    try {
      const result = await useCase.execute({
        adminUserId,
        targetUserId: params.userId,
        isActive: body.isActive,
      });

      return sendSuccess(res, "User status updated successfully", result);
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      if (
        error instanceof Error &&
        error.message === "CANNOT_DEACTIVATE_SELF"
      ) {
        throw new AppError(
          "You cannot deactivate your own admin account",
          400,
          "CANNOT_DEACTIVATE_SELF",
        );
      }

      if (
        error instanceof Error &&
        error.message === "CANNOT_DEACTIVATE_LAST_ADMIN"
      ) {
        throw new AppError(
          "You cannot deactivate the last active admin account",
          400,
          "CANNOT_DEACTIVATE_LAST_ADMIN",
        );
      }

      if (error instanceof Error && error.message === "USER_UPDATE_FAILED") {
        throw new AppError(
          "Failed to update user status",
          500,
          "USER_UPDATE_FAILED",
        );
      }

      throw error;
    }
  },

  async updateUserRole(req: AuthRequest, res: Response) {
    const adminUserId = getAdminUserId(req);
    const params = userIdParamSchema.parse(req.params);
    const body = updateUserRoleSchema.parse(req.body);

    const useCase = makeUpdateUserRoleUseCase();

    try {
      const result = await useCase.execute({
        adminUserId,
        targetUserId: params.userId,
        role: body.role,
      });

      return sendSuccess(res, "User role updated successfully", result);
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      if (error instanceof Error && error.message === "CANNOT_CHANGE_OWN_ROLE") {
        throw new AppError(
          "You cannot change your own admin role",
          400,
          "CANNOT_CHANGE_OWN_ROLE",
        );
      }

      if (
        error instanceof Error &&
        error.message === "CANNOT_DEMOTE_LAST_ADMIN"
      ) {
        throw new AppError(
          "You cannot demote the last active admin account",
          400,
          "CANNOT_DEMOTE_LAST_ADMIN",
        );
      }

      if (error instanceof Error && error.message === "USER_UPDATE_FAILED") {
        throw new AppError(
          "Failed to update user role",
          500,
          "USER_UPDATE_FAILED",
        );
      }

      throw error;
    }
  },
};