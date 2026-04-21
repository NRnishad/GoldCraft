import { apiRequest } from "../../../shared/services/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "jeweller" | "admin";
};

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

export async function loginRequest(input: {
  email: string;
  password: string;
}) {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}

export async function meRequest(token: string) {
  const response = await apiRequest<MeResponse>("/auth/me", {}, token);
  return response.data.user;
}

