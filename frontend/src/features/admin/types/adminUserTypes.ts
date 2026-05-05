export type AdminUserRole = "jeweller" | "admin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListAdminUsersParams {
  search?: string;
  role?: AdminUserRole | "";
  isActive?: boolean | "";
  isEmailVerified?: boolean | "";
  page?: number;
  limit?: number;
}

export interface ListAdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    pagination: AdminUsersPagination;
  };
}

export interface GetAdminUserDetailsResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUser;
  };
}

export interface UpdateAdminUserResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUser;
  };
}

export interface UpdateAdminUserStatusInput {
  isActive: boolean;
}

export interface UpdateAdminUserRoleInput {
  role: AdminUserRole;
}