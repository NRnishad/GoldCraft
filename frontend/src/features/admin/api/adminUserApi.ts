import { httpClient } from "../../../shared/api/httpClient";
import type {
  GetAdminUserDetailsResponse,
  ListAdminUsersParams,
  ListAdminUsersResponse,
  UpdateAdminUserResponse,
  UpdateAdminUserRoleInput,
  UpdateAdminUserStatusInput,
} from "../types/adminUserTypes";

export const adminUserApi = {
  listUsers(params: ListAdminUsersParams) {
    return httpClient.get<ListAdminUsersResponse>("/admin/users", {
      params: cleanParams(params),
    });
  },

  getUserDetails(userId: string) {
    return httpClient.get<GetAdminUserDetailsResponse>(
      `/admin/users/${userId}`
    );
  },

  updateUserStatus(userId: string, input: UpdateAdminUserStatusInput) {
    return httpClient.patch<UpdateAdminUserResponse>(
      `/admin/users/${userId}/status`,
      input
    );
  },

  updateUserRole(userId: string, input: UpdateAdminUserRoleInput) {
    return httpClient.patch<UpdateAdminUserResponse>(
      `/admin/users/${userId}/role`,
      input
    );
  },
};

function cleanParams(params: ListAdminUsersParams) {
  const cleanedParams: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      cleanedParams[key] = value;
    }
  });

  return cleanedParams;
}