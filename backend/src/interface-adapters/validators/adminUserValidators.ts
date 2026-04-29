import { z } from "zod";

function parseOptionalBoolean(value: unknown) {
  if (value === undefined) return undefined;

  if (value === "true") return true;
  if (value === "false") return false;

  return value;
}

export const listUsersQuerySchema = z.object({
  search: z.string().trim().optional(),
  role: z.enum(["jeweller", "admin"]).optional(),
  isActive: z
    .preprocess(parseOptionalBoolean, z.boolean().optional()),
  isEmailVerified: z
    .preprocess(parseOptionalBoolean, z.boolean().optional()),
  page: z
    .preprocess(
      (value) => (value === undefined ? 1 : Number(value)),
      z.number().int().min(1),
    )
    .optional(),
  limit: z
    .preprocess(
      (value) => (value === undefined ? 10 : Number(value)),
      z.number().int().min(1).max(100),
    )
    .optional(),
});

export const userIdParamSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "isActive is required",
  }),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["jeweller", "admin"], {
    required_error: "Role is required",
  }),
});